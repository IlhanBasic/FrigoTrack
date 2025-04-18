import Product from "../models/product.model.js";
import ColdRoom from "../models/coldRoom.model.js";
import mongoose from "mongoose";

const validateProductData = (data, isUpdate = false) => {
  const errors = {};
  const currentYear = new Date().getFullYear();

  const validNames = [
    "malina",
    "jagoda",
    "ribizla",
    "kupina",
    "borovnica",
    "tresnja",
    "visnja",
  ];
  const validFreezingMethods = ["IQF", "block"];

  // Naziv proizvoda
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || !validNames.includes(data.name)) {
      errors.name = "Validno ime proizvoda je neophodno.";
    }
  }
  // Vrsta
  if (!isUpdate || data.variety !== undefined) {
    if (
      !data.variety ||
      typeof data.variety !== "string" ||
      data.variety.trim() === ""
    ) {
      errors.variety = "Validna vrsta proizvoda je neophodna.";
    }
  }

  // Godina berbe
  if (!isUpdate || data.harvestYear !== undefined) {
    if (
      !data.harvestYear ||
      isNaN(data.harvestYear) ||
      data.harvestYear < 2020 ||
      data.harvestYear > currentYear
    ) {
      errors.harvestYear = `Godina berbe mora biti između 2020 i ${currentYear}.`;
    }
  }

  // Nabavna cena
  if (!isUpdate || data.purchasePrice !== undefined) {
    if (
      data.purchasePrice === undefined ||
      isNaN(data.purchasePrice) ||
      data.purchasePrice < 0
    ) {
      errors.purchasePrice = "Validna nabavna cena je neophodna.";
    }
  }

  // Prodajna cena
  if (!isUpdate || data.sellingPrice !== undefined) {
    if (
      data.sellingPrice === undefined ||
      isNaN(data.sellingPrice) ||
      data.sellingPrice < 0
    ) {
      errors.sellingPrice = "Validna prodajna cena je neophodna.";
    }
  }

  // Poređenje cena
  if (data.purchasePrice !== undefined && data.sellingPrice !== undefined) {
    if (data.sellingPrice < data.purchasePrice) {
      errors.sellingPrice = "Prodajna cena ne može biti manja od nabavne cene.";
    }
  }

  // Minimalna zaliha
  if (!isUpdate || data.minStockKg !== undefined) {
    if (isNaN(data.minStockKg) || data.minStockKg < 0) {
      errors.minStockKg = "Minimalna zaliha mora biti nenegativan broj.";
    }
  }

  // Hladnjača
  if (!isUpdate || data.coldRoomId !== undefined) {
    if (!data.coldRoomId || typeof data.coldRoomId !== "string") {
      errors.coldRoomId = "Hladnjača je obavezna.";
    }
  }

  // Datum isteka
  if (!isUpdate || data.expiryDate !== undefined) {
    if (data.expiryDate) {
      const expiry = new Date(data.expiryDate);
      const today = new Date();
      if (expiry < today) {
        errors.expiryDate = "Datum isteka mora biti u budućnosti.";
      }
    }
  }

  // Pokazatelji kvaliteta (ako postoje)
  if (
    data.brix !== undefined &&
    (isNaN(data.brix) || data.brix < 0 || data.brix > 100)
  ) {
    errors.brix = "Brix mora biti broj između 0 i 100.";
  }

  if (data.acidity !== undefined && (isNaN(data.acidity) || data.acidity < 0)) {
    errors.acidity = "Kiselost ne može biti negativna.";
  }

  if (
    data.sugarContent !== undefined &&
    (isNaN(data.sugarContent) ||
      data.sugarContent < 0 ||
      data.sugarContent > 100)
  ) {
    errors.sugarContent = "Procenat šećera mora biti između 0 i 100.";
  }

  if (
    data.freezingMethod !== undefined &&
    !validFreezingMethods.includes(data.freezingMethod)
  ) {
    errors.freezingMethod = "Nevalidan metod zamrzavanja.";
  }
  if (!isUpdate) {
    data.sku = `${data.name.slice(0, 3).toUpperCase()}-${data.variety
      .slice(0, 3)
      .toUpperCase()}-${data.harvestYear.toString()}`;
  }
  return Object.keys(errors).length > 0 ? errors : null;
};


export const getAllProducts = async (req, res) => {
  try {
    const { activeOnly = true } = req.query;
    const filter = activeOnly === "true" ? { isActive: true } : {};

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Neuspešno preuzimanje proizvoda.",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ message: "Nevalidan ID format za proizvod." });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Proizvod nije pronadjen." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Neuspešno preuzimanje proizvoda.",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const validationErrors = validateProductData(req.body);
    if (validationErrors) {
      return res.status(400).json({
        message: "Neuspešna validacija.",
        errors: validationErrors,
      });
    }

    if (req.body.sku) {
      const existingProduct = await Product.findOne({ sku: req.body.sku });
      if (existingProduct) {
        return res.status(400).json({
          message: "Proizvod sa tim sku već postoji.",
        });
      }
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      message: "Proizvod uspešno kreiran.",
      product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      return res.status(400).json({
        message: "Neuspešna validacija.",
        errors,
      });
    }
    res.status(500).json({
      message: "Neuspešno kreiran proizvod.",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Nevalidan ID proizvoda." });
    }

    const validationErrors = validateProductData(req.body, true);
    if (validationErrors) {
      return res.status(400).json({
        message: "Neuspešna validacija.",
        errors: validationErrors,
      });
    }

    if (req.body.sku) {
      const existingProduct = await Product.findOne({
        sku: req.body.sku,
        _id: { $ne: req.params.id },
      });
      if (existingProduct) {
        return res.status(400).json({
          message: "Drugi proizvod postoji sa istim sku već.",
        });
      }
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Proizvod nije pronađen." });
    }

    if (
      req.body.coldRoomId &&
      req.body.coldRoomId !== product.coldRooms[0]?.coldRoom.toString()
    ) {
      const coldRoomObjectId = mongoose.Types.ObjectId(req.body.coldRoomId);

      await Product.updateOne(
        { _id: req.params.id },
        {
          $pull: {
            coldRooms: { coldRoom: product.coldRooms[0]?.coldRoom },
          },
        }
      );

      await Product.updateOne(
        { _id: req.params.id },
        {
          $push: {
            coldRooms: {
              coldRoom: coldRoomObjectId, // koristi ObjectId
              quantityKg: req.body.currentStockKg,
              storageDate: new Date(),
            },
          },
        }
      );
    }

    // Ažuriraj proizvod sa novim podacima
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Proizvod nije pronađen." });
    }

    res.status(200).json({
      message: "Proizvod uspešno azuriran.",
      product: updatedProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      return res.status(400).json({
        message: "Neuspešna validacija.",
        errors,
      });
    }
    res.status(500).json({
      message: "Neuspešno azuriranje proizvoda.",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ message: "Nevažeći ID format za proizvod" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Proizvod nije pronadjen." });
    }

    res.status(200).json({
      message: "Proizvod je obrisan.",
      deletedProduct: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspešno brisanje proizvoda.",
      error: error.message,
    });
  }
};

export const storeProductInColdRoom = async (req, res) => {
  const { productId, coldRoomId, quantityKg, storageDate } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = await Product.findById(productId).session(session);
    const coldRoom = await ColdRoom.findOne({ roomNumber: coldRoomId }).session(
      session
    );
    console.log(productId, coldRoomId);
    if (!product || !coldRoom) {
      throw new Error("Proizvod ili komora nisu pronadjeni.");
    }

    // 1. Proveri da li ima mesta u hladnjači
    if (coldRoom.currentLoadKg + quantityKg > coldRoom.capacityKg) {
      throw new Error("Nema dovoljno kapaciteta u hladnjači.");
    }

    // 2. Dodaj coldRoom info u product
    const existingColdRoom = product.coldRooms.find(
      (cr) => cr.coldRoom.toString() === coldRoom._id.toString()
    );
    if (existingColdRoom) {
      existingColdRoom.quantityKg += quantityKg;
      existingColdRoom.storageDate =
        storageDate && new Date(storageDate) > existingColdRoom.storageDate
          ? new Date(storageDate)
          : existingColdRoom.storageDate;
    } else {
      product.coldRooms.push({
        coldRoom: coldRoom._id,
        quantityKg,
        storageDate: storageDate ? new Date(storageDate) : new Date(),
      });
    }

    product.currentStockKg += quantityKg;

    await product.save({ session });

    // 3. Ažuriraj hladnjaču
    coldRoom.currentLoadKg += quantityKg;

    await coldRoom.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Proizvod uspešno dodat u hladnjaču." });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const sellingProducts = async (req, res) => {
  // implementirati
  try {
    const { items } = req.body;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      const coldroom = await ColdRoom.findById(product.coldRooms[0].coldRoom);
      if (!product) {
        return res.status(404).json({ message: "Nije pronadjen proizvod." });
      }
      if (!coldroom) {
        return res.status(404).json({ message: "Nije pronadjena komora." });
      }
      if (
        product.currentStockKg < item.quantity ||
        coldroom.currentLoadKg < item.quantity
      ) {
        return res.status(400).json({ message: "Nema dovoljno proizvoda." });
      }
      product.currentStockKg -= item.quantity;
      coldroom.currentLoadKg -= item.quantity;
      await product.save();
      await coldroom.save();
      res.status(200).json({ message: "Proizvod uspešno prodat." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Greška na serveru", error: err.message });
  }
};

export const buyingProducts = async (req, res) => {
  //implementirati
  try {
    const { items } = req.body;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      const coldroom = await ColdRoom.findById(product.coldRooms[0].coldRoom);
      if (!product) {
        return res.status(404).json({ message: "Nije pronadjen proizvod." });
      }
      if (!coldroom) {
        return res.status(404).json({ message: "Nije pronadjena komora." });
      }
      product.currentStockKg += item.quantity;
      coldroom.currentLoadKg += item.quantity;
      await product.save();
      await coldroom.save();
      res.status(200).json({ message: "Proizvod uspešno kupljen." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Greška na serveru", error: err.message });
  }
};


