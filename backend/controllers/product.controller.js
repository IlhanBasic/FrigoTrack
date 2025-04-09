import Product from "../models/product.model.js";
import mongoose from "mongoose";

// Helper function for validation
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
      errors.name = "Valid product name is required";
    }
  }

  if (!isUpdate || data.variety !== undefined) {
    if (
      !data.variety ||
      typeof data.variety !== "string" ||
      data.variety.trim() === ""
    ) {
      errors.variety = "Variety is required";
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
      errors.harvestYear = `Harvest year must be between 2020 and ${currentYear}`;
    }
  }

  if (!isUpdate || data.purchasePrice !== undefined) {
    if (
      data.purchasePrice === undefined ||
      isNaN(data.purchasePrice) ||
      data.purchasePrice < 0
    ) {
      errors.purchasePrice = "Valid purchase price is required";
    }
  }

  if (!isUpdate || data.sellingPrice !== undefined) {
    if (
      data.sellingPrice === undefined ||
      isNaN(data.sellingPrice) ||
      data.sellingPrice < 0
    ) {
      errors.sellingPrice = "Valid selling price is required";
    }
  }

  // SKU format validation if provided
  if (data.sku && !/^[A-Z]{3}-[A-Z]{3}-\d{4}$/.test(data.sku)) {
    errors.sku = "SKU must be in format XXX-XXX-YYYY";
  }

  // Validate prices relationship
  if (data.purchasePrice !== undefined && data.sellingPrice !== undefined) {
    if (data.sellingPrice < data.purchasePrice) {
      errors.sellingPrice = "Selling price cannot be lower than purchase price";
    }
  }

  // Quality indicators validation if provided
  if (data.qualityIndicators) {
    if (
      data.qualityIndicators.sugarContent !== undefined &&
      (data.qualityIndicators.sugarContent < 0 ||
        data.qualityIndicators.sugarContent > 100)
    ) {
      errors["qualityIndicators.sugarContent"] =
        "Sugar content must be between 0 and 100";
    }

    if (
      data.qualityIndicators.acidity !== undefined &&
      data.qualityIndicators.acidity < 0
    ) {
      errors["qualityIndicators.acidity"] = "Acidity cannot be negative";
    }

    if (
      data.qualityIndicators.freezingMethod &&
      !["IQF", "block"].includes(data.qualityIndicators.freezingMethod)
    ) {
      errors["qualityIndicators.freezingMethod"] = "Invalid freezing method";
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
      message: "Failed to retrieve products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve product",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const validationErrors = validateProductData(req.body);
    if (validationErrors) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Check for duplicate SKU if provided
    if (req.body.sku) {
      const existingProduct = await Product.findOne({ sku: req.body.sku });
      if (existingProduct) {
        return res.status(400).json({
          message: "Product with this SKU already exists",
        });
      }
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle mongoose validation errors
      const errors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const validationErrors = validateProductData(req.body, true);
    if (validationErrors) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Check for duplicate SKU if provided in update
    if (req.body.sku) {
      const existingProduct = await Product.findOne({
        sku: req.body.sku,
        _id: { $ne: req.params.id },
      });
      if (existingProduct) {
        return res.status(400).json({
          message: "Another product with this SKU already exists",
        });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle mongoose validation errors
      const errors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({
      message: "Product deleted successfully.",
      deletedProduct: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
