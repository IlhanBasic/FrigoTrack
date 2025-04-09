import Document from "../models/document.model.js";
import mongoose from "mongoose";

const validateDocumentData = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate || data.type !== undefined) {
    if (!["otkup", "prodaja", "premestaj", "otpis"].includes(data.type)) {
      errors.type = "Invalid document type";
    }
  }

  if (data.documentNumber) {
    const prefix = data.type ? data.type.toUpperCase().substring(0, 3) : "";
    const regex = new RegExp(`^${prefix}-\\d{4}-\\d{3}$`);
    if (!regex.test(data.documentNumber)) {
      errors.documentNumber = `Document number must match format ${prefix}-YYYY-NNN`;
    }
  }

  if (!isUpdate || data.partner !== undefined) {
    if (!data.partner || !mongoose.Types.ObjectId.isValid(data.partner)) {
      errors.partner = "Valid partner reference is required";
    }
  }

  if (data.items && Array.isArray(data.items)) {
    if (data.items.length === 0) {
      errors.items = "Document must have at least one item";
    } else {
      data.items.forEach((item, index) => {
        if (
          !item.productId ||
          !mongoose.Types.ObjectId.isValid(item.productId)
        ) {
          errors[`items.${index}.productId`] =
            "Valid product reference is required";
        }
        if (item.quantity === undefined || item.quantity <= 0) {
          errors[`items.${index}.quantity`] = "Valid quantity is required";
        }
        if (
          ["otkup", "prodaja"].includes(data.type) &&
          (item.pricePerUnit === undefined || item.pricePerUnit < 0)
        ) {
          errors[`items.${index}.pricePerUnit`] = "Valid price is required";
        }
        if (
          ["otkup", "prodaja"].includes(data.type) &&
          (item.vatRate === undefined || item.vatRate < 0 || item.vatRate > 100)
        ) {
          errors[`items.${index}.vatRate`] = "Valid VAT rate is required";
        }
      });
    }
  }

  if (data.transport) {
    if (
      data.transport.driverName &&
      typeof data.transport.driverName !== "string"
    ) {
      errors["transport.driverName"] = "Driver name must be a string";
    }
    if (
      data.transport.vehiclePlate &&
      typeof data.transport.vehiclePlate !== "string"
    ) {
      errors["transport.vehiclePlate"] = "Vehicle plate must be a string";
    }
    if (
      data.transport.cost !== undefined &&
      (isNaN(data.transport.cost) || data.transport.cost < 0)
    ) {
      errors["transport.cost"] = "Valid transport cost is required";
    }
  }

  if (
    data.status &&
    !["u pripremi", "potvrđen", "otpremljen", "storniran"].includes(data.status)
  ) {
    errors.status = "Invalid document status";
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
      message: "Failed to retrieve documents",
      error: error.message,
    });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID format",
      });
    }

    const document = await Document.findById(req.params.id)
      .populate("partner", "name address")
      .populate("items.productId", "name variety sku")
      .populate("createdBy", "name email");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve document",
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
        message: "Validation failed",
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
          message: "Document with this number already exists",
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
      message: "Document created successfully",
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
        message: "Validation failed",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create document",
      error: error.message,
    });
  }
};

export const updateDocument = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID format",
      });
    }

    const validationErrors = validateDocumentData(req.body, true);
    if (validationErrors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
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
          message: "Another document with this number already exists",
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
        message: "Document not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Document updated successfully",
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
        message: "Validation failed",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update document",
      error: error.message,
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID format",
      });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    if (document.status === "potvrđen" || document.status === "otpremljen") {
      return res.status(400).json({
        success: false,
        message: "Confirmed or shipped documents cannot be deleted",
      });
    }

    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete document",
      error: error.message,
    });
  }
};
