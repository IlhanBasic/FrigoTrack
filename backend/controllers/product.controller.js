import Product from "../models/product.model.js";
import mongoose from "mongoose";

const validateProductData = (data, isUpdate = false) => {
  const errors = {};

  // Required fields validation
  if (!isUpdate || data.name !== undefined) {
    if (
      !data.name ||
      ![
        "malina",
        "jagoda",
        "ribizla",
        "kupina",
        "borovnica",
        "trešnja",
        "višnja",
      ].includes(data.name)
    ) {
      errors.name = "Validno ime proizvoda je neophodno.";
    }
  }

  if (!isUpdate || data.variety !== undefined) {
    if (
      !data.variety ||
      typeof data.variety !== "string" ||
      data.variety.trim() === ""
    ) {
      errors.variety = "Validna vrsta proizvoda je neophodna.";
    }
  }

  if (!isUpdate || data.harvestYear !== undefined) {
    const currentYear = new Date().getFullYear();
    if (
      !data.harvestYear ||
      isNaN(data.harvestYear) ||
      data.harvestYear < 2020 ||
      data.harvestYear > currentYear
    ) {
      errors.harvestYear = `Godina berbe mora biti veća od 2020 i manja od ${currentYear}.`;
    }
  }

  if (!isUpdate || data.purchasePrice !== undefined) {
    if (
      data.purchasePrice === undefined ||
      isNaN(data.purchasePrice) ||
      data.purchasePrice < 0
    ) {
      errors.purchasePrice = "Validna nabavna cena je neophodna.";
    }
  }

  if (!isUpdate || data.sellingPrice !== undefined) {
    if (
      data.sellingPrice === undefined ||
      isNaN(data.sellingPrice) ||
      data.sellingPrice < 0
    ) {
      errors.sellingPrice = "Validna prodajna cena je neophodna.";
    }
  }

  if (data.sku && !/^[A-Z]{3}-[A-Z]{3}-\d{4}$/.test(data.sku)) {
    errors.sku = "SKU mora biti u formatu XXX-XXX-YYYY.";
  }
  if (data.purchasePrice !== undefined && data.sellingPrice !== undefined) {
    if (data.sellingPrice < data.purchasePrice) {
      errors.sellingPrice = "Prodajna cena ne može biti manja od nabavne cene.";
    }
  }

  if (data.qualityIndicators) {
    if (
      data.qualityIndicators.sugarContent !== undefined &&
      (data.qualityIndicators.sugarContent < 0 ||
        data.qualityIndicators.sugarContent > 100)
    ) {
      errors["qualityIndicators.sugarContent"] =
        "Procenat šećera mora biti između 0 i 100";
    }

    if (
      data.qualityIndicators.acidity !== undefined &&
      data.qualityIndicators.acidity < 0
    ) {
      errors["qualityIndicators.acidity"] = "Kiselost ne može biti negativna.";
    }

    if (
      data.qualityIndicators.freezingMethod &&
      !["IQF", "block"].includes(data.qualityIndicators.freezingMethod)
    ) {
      errors["qualityIndicators.freezingMethod"] = "Nevalidan metod zamrzavanja.";
    }
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
      return res.status(400).json({ message: "Nevalidan ID format za proizvod." });
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

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Proizvod nije pronadjen." });
    }

    res.status(200).json({
      message: "Proizvod uspešno azuriran.",
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
      message: "Neuspešno azuriranje proizvoda.",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Nevažeći ID format za proizvod" });
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
