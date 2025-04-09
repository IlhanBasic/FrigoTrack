import Payment from "../models/payment.model.js";
import mongoose from "mongoose";
import Document from "../models/document.model.js";

const validatePaymentData = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate || data.document !== undefined) {
    if (!data.document || !mongoose.Types.ObjectId.isValid(data.document)) {
      errors.document = "Valid document reference is required";
    }
  }

  if (!isUpdate || data.amountPaid !== undefined) {
    if (
      data.amountPaid === undefined ||
      isNaN(data.amountPaid) ||
      data.amountPaid <= 0
    ) {
      errors.amountPaid = "Valid payment amount is required";
    }
  }

  if (data.paymentDate) {
    const paymentDate = new Date(data.paymentDate);
    if (isNaN(paymentDate.getTime())) {
      errors.paymentDate = "Valid payment date is required";
    } else if (paymentDate > new Date()) {
      errors.paymentDate = "Payment date cannot be in the future";
    }
  }

  if (!isUpdate || data.method !== undefined) {
    if (data.method && !["gotovina", "račun"].includes(data.method)) {
      errors.method = "Valid payment method is required";
    }
  }

  if (data.recordedBy && !mongoose.Types.ObjectId.isValid(data.recordedBy)) {
    errors.recordedBy = "Valid user reference is required";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const getAllPayments = async (req, res) => {
  try {
    const { document, method, startDate, endDate, minAmount, maxAmount } =
      req.query;
    const filter = {};

    if (document) filter.document = document;
    if (method) filter.method = method;
    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) filter.paymentDate.$gte = new Date(startDate);
      if (endDate) filter.paymentDate.$lte = new Date(endDate);
    }
    if (minAmount || maxAmount) {
      filter.amountPaid = {};
      if (minAmount) filter.amountPaid.$gte = Number(minAmount);
      if (maxAmount) filter.amountPaid.$lte = Number(maxAmount);
    }

    const payments = await Payment.find(filter)
      .populate("document", "documentNumber type")
      .populate("recordedBy", "name email");

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payments",
      error: error.message,
    });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID format",
      });
    }

    const payment = await Payment.findById(req.params.id)
      .populate("document", "documentNumber type date")
      .populate("recordedBy", "name email");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payment",
      error: error.message,
    });
  }
};

export const createPayment = async (req, res) => {
  try {
    const validationErrors = validatePaymentData(req.body);
    if (validationErrors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const document = await Document.findById(req.body.document);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Referenced document not found",
      });
    }

    const paymentData = {
      ...req.body,
      paymentDate: req.body.paymentDate || new Date(),
      recordedBy: req.user?._id,
    };

    const payment = await Payment.create(paymentData);

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
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
      message: "Failed to create payment",
      error: error.message,
    });
  }
};

export const updatePayment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID format",
      });
    }

    const validationErrors = validatePaymentData(req.body, true);
    if (validationErrors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    if (req.body.document) {
      const document = await Document.findById(req.body.document);
      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Referenced document not found",
        });
      }
    }

    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: payment,
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
      message: "Failed to update payment",
      error: error.message,
    });
  }
};

export const deletePayment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID format",
      });
    }

    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully.",
      data: {
        id: payment._id,
        amount: payment.amountPaid,
        document: payment.document,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete payment",
      error: error.message,
    });
  }
};
