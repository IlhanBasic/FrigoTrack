import Document from "../models/document.model.js";
import mongoose from "mongoose";

const validateDocumentData = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate || data.type !== undefined) {
    if (!["otkup", "prodaja", "premestaj", "otpis"].includes(data.type)) {
      errors.type = "Nevalidan tip dokumenta.";
    }
  }

  if (data.documentNumber) {
    const prefix = data.type ? data.type.toUpperCase().substring(0, 3) : "";
    const regex = new RegExp(`^${prefix}-\\d{4}-\\d{3}$`);
    if (!regex.test(data.documentNumber)) {
      errors.documentNumber = `Broj dokumenta mora pratiti format ${prefix}-YYYY-NNN.`;
    }
  }

  if (!isUpdate || data.partner !== undefined) {
    if (!data.partner || !mongoose.Types.ObjectId.isValid(data.partner)) {
      errors.partner = "Validna referenca na partnera je neophodna.";
    }
  }

  if (data.items && Array.isArray(data.items)) {
    if (data.items.length === 0) {
      errors.items = "Dokument mora uključivati najmanje jednu stavku.";
    } else {
      data.items.forEach((item, index) => {
        if (
          !item.productId ||
          !mongoose.Types.ObjectId.isValid(item.productId)
        ) {
          errors[`items.${index}.productId`] =
            "Validna referenca na proizvod je neophodna.";
        }
        if (item.quantity === undefined || item.quantity <= 0) {
          errors[`items.${index}.quantity`] = "Validna količina je neophodna.";
        }
        if (
          ["otkup", "prodaja"].includes(data.type) &&
          (item.pricePerUnit === undefined || item.pricePerUnit < 0)
        ) {
          errors[`items.${index}.pricePerUnit`] = "Validna cena je neophodna.";
        }
        if (
          ["otkup", "prodaja"].includes(data.type) &&
          (item.vatRate === undefined || item.vatRate < 0 || item.vatRate > 100)
        ) {
          errors[`items.${index}.vatRate`] = "Validan PDV % je neophodan.";
        }
      });
    }
  }

  if (data.transport) {
    if (
      data.transport.driverName &&
      typeof data.transport.driverName !== "string"
    ) {
      errors["transport.driverName"] = "Ime vozača mora biti string.";
    }
    if (
      data.transport.vehiclePlate &&
      typeof data.transport.vehiclePlate !== "string"
    ) {
      errors["transport.vehiclePlate"] = "Broj tablica mora biti string.";
    }
    if (
      data.transport.cost !== undefined &&
      (isNaN(data.transport.cost) || data.transport.cost < 0)
    ) {
      errors["transport.cost"] = "Validna cena troška prevoza je neophodna.";
    }
  }

  if (
    data.status &&
    !["u pripremi", "potvrđen", "otpremljen", "storniran"].includes(data.status)
  ) {
    errors.status = "Nevalidan status dokumenta.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const getAllDocuments = async (req, res) => {
  try {
    const { type, status, partner, startDate, endDate } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (partner) filter.partner = partner;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const documents = await Document.find(filter)
      .populate("partner", "name")
      .populate("items.productId", "name variety")
      .populate("createdBy", "name");

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Neuspešno preuzimanje dokumenata.",
      error: error.message,
    });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Nevalidan ID format.",
      });
    }

    const document = await Document.findById(req.params.id)
      .populate("partner", "name address")
      .populate("items.productId", "name variety sku")
      .populate("createdBy", "name email");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Dokument nije pronadjen.",
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Neuspešno preuzimanje dokumenta.",
      error: error.message,
    });
  }
};

export const createDocument = async (req, res) => {
  try {
    const validationErrors = validateDocumentData(req.body);
    if (validationErrors) {
      return res.status(400).json({
        success: false,
        message: "Neuspešna validacija",
        errors: validationErrors,
      });
    }

    if (req.body.documentNumber) {
      const existingDoc = await Document.findOne({
        documentNumber: req.body.documentNumber,
      });
      if (existingDoc) {
        return res.status(400).json({
          success: false,
          message: "Dokument sa tim brojem već postoji.",
        });
      }
    }

    if (req.body.items && ["otkup", "prodaja"].includes(req.body.type)) {
      req.body.items = req.body.items.map((item) => ({
        ...item,
        total: item.quantity * item.pricePerUnit * (1 + item.vatRate / 100),
      }));
    }

    const document = await Document.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: "Document je uspešno kreiran.",
      data: document,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      return res.status(400).json({
        success: false,
        message: "Neuspešna validacija.",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Neuspešno kreiranje dokumenta.",
      error: error.message,
    });
  }
};

export const updateDocument = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Nevalidan Id dokumenta.",
      });
    }

    const validationErrors = validateDocumentData(req.body, true);
    if (validationErrors) {
      return res.status(400).json({
        success: false,
        message: "Neuspešna validacija.",
        errors: validationErrors,
      });
    }

    if (req.body.documentNumber) {
      const existingDoc = await Document.findOne({
        documentNumber: req.body.documentNumber,
        _id: { $ne: req.params.id },
      });
      if (existingDoc) {
        return res.status(400).json({
          success: false,
          message: "Neki drugi dokument sa ovim brojem već postoji.",
        });
      }
    }

    if (req.body.items && ["otkup", "prodaja"].includes(req.body.type)) {
      req.body.items = req.body.items.map((item) => ({
        ...item,
        total: item.quantity * item.pricePerUnit * (1 + item.vatRate / 100),
      }));
    }

    const document = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Dokument nije pronadjen.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dokument je uspešno izmenjen.",
      data: document,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      return res.status(400).json({
        success: false,
        message: "Neuspešna validacija.",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Neuspešna izmena dokumenta.",
      error: error.message,
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Nevalidan Id dokumenta.",
      });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Dokument nije pronadjen.",
      });
    }

    if (document.status === "potvrđen" || document.status === "otpremljen") {
      return res.status(400).json({
        success: false,
        message: "Ne možete obrisati potvrđen ili otpremljen dokument.",
      });
    }

    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Dokument je uspešno obrisan.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Neuspešno brisanje dokumenta.",
      error: error.message,
    });
  }
};
