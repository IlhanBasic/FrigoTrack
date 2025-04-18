import Payment from "../models/payment.model.js";
import mongoose from "mongoose";
import Document from "../models/document.model.js";

const validatePaymentData = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate || data.document !== undefined) {
    if (!data.document || !mongoose.Types.ObjectId.isValid(data.document)) {
      errors.document = "Validna referenca na dokument je neophodna.";
    }
  }
  data.paymentDate = new Date();
  if (data.recordedBy && !mongoose.Types.ObjectId.isValid(data.recordedBy)) {
    errors.recordedBy = "Validna referenca na korisnika je neophodna.";
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
      message: "Neuspešno preuzimanje plaćanja.",
      error: error.message,
    });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Nevalidan ID format.",
      });
    }

    const payment = await Payment.findById(req.params.id)
      .populate("document", "documentNumber type date")
      .populate("recordedBy", "name email");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Plaćanje nije pronađeno.",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Neuspešno preuzimanje plaćanja.",
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
        message: "Neuspešna validacija.",
        errors: validationErrors,
      });
    }

    const document = await Document.findById(req.body.document);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Dokument nije pronađen.",
      });
    }
    if(document.isPaid){
      return res.status(500).json({
        success:false,
        message:"Dokument je već plaćen."
      });
    }
    const paymentData = {
      ...req.body,
      paymentDate: req.body.paymentDate || new Date(),
      recordedBy: req.user?._id,
    };

    const payment = await Payment.create(paymentData);
    document.isPaid = true;
    await document.save();
    res.status(201).json({
      success: true,
      message: "Uspеšno kreiranje plaćanja.",
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
        message: "Neuspešna validacija",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Neuspešno kreiranje plaćanja",
      error: error.message,
    });
  }
};

// export const updatePayment = async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Nevalidan ID format.",
//       });
//     }

//     const validationErrors = validatePaymentData(req.body, true);
//     if (validationErrors) {
//       return res.status(400).json({
//         success: false,
//         message: "Neuspešna validacija.",
//         errors: validationErrors,
//       });
//     }

//     if (req.body.document) {
//       const document = await Document.findById(req.body.document);
//       if (!document) {
//         return res.status(404).json({
//           success: false,
//           message: "Dokument nije pronađen.",
//         });
//       }
//     }

//     const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Plaćanje nije pronađeno.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Uspеšno azuriranje plaćanja.",
//       data: payment,
//     });
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       const errors = Object.values(error.errors).reduce((acc, err) => {
//         acc[err.path] = err.message;
//         return acc;
//       }, {});
//       return res.status(400).json({
//         success: false,
//         message: "Neuspešna validacija.",
//         errors,
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: "Neuspešno azuriranje plaćanja.",
//       error: error.message,
//     });
//   }
// };

// export const deletePayment = async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Nevalidan ID format.",
//       });
//     }

//     const payment = await Payment.findByIdAndDelete(req.params.id);

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Plaćanje nije pronađeno.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Uspеšno brisanje plaćanja.",
//       data: {
//         id: payment._id,
//         amount: payment.amountPaid,
//         document: payment.document,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Neuspešno brisanje plaćanja.",
//       error: error.message,
//     });
//   }
// };
