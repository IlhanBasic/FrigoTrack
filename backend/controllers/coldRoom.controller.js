import ColdRoom from "../models/coldRoom.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

const validateColdRoomData = (data) => {
  const errors = {};

  if (!data.roomNumber || typeof data.roomNumber !== "string") {
    errors.roomNumber = "Validna komora je potrebna.";
  }

  if (data.temperature === undefined || typeof data.temperature !== "number") {
    errors.temperature = "Validna temperatura je neophodna.";
  } else if (data.temperature > 0) {
    errors.temperature = "Temperatura mora biti manja od nule.";
  }

  if (
    data.capacityKg === undefined ||
    typeof data.capacityKg !== "number" ||
    data.capacityKg <= 0
  ) {
    errors.capacityKg = "Validan kapacitet je neophodan.";
  }

  if (!data.location || typeof data.location !== "string") {
    errors.location = "Validna lokacija je neophodna.";
  }

  if (!data.type || !["standard", "shock freezer"].includes(data.type)) {
    errors.type = "Validan tip (standard ili shock freezer) je neophodan.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const getAllColdRooms = async (req, res) => {
  try {
    const { isActive, type, minTemp, maxTemp } = req.query;
    const filter = {};

    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (type) filter.type = type;
    if (minTemp || maxTemp) {
      filter.temperature = {};
      if (minTemp) filter.temperature.$gte = Number(minTemp);
      if (maxTemp) filter.temperature.$lte = Number(maxTemp);
    }

    const coldRooms = await ColdRoom.find(filter).sort({ roomNumber: 1 });
    res.status(200).json({
      success: true,
      count: coldRooms.length,
      data: coldRooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Neuspelo preuzimanje komora.",
      error: error.message,
    });
  }
};

export const getColdRoomById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Nevalidan ID komore.",
      });
    }

    const coldRoom = await ColdRoom.findById(req.params.id);
    if (!coldRoom) {
      return res.status(404).json({
        success: false,
        message: "Komora nije pronadjena.",
      });
    }

    res.status(200).json({
      success: true,
      data: coldRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Neuspelo preuzimanje komora.",
      error: error.message,
    });
  }
};

export const createColdRoom = async (req, res) => {
  const validationErrors = validateColdRoomData(req.body);
  if (validationErrors) {
    return res.status(400).json({
      success: false,
      message: "Neuspešna validacija.",
      errors: validationErrors,
    });
  }

  try {
    const existingColdRoom = await ColdRoom.findOne({
      roomNumber: req.body.roomNumber,
    });
    if (existingColdRoom) {
      return res.status(400).json({
        success: false,
        message: "Komora sa tim brojem već postoji.",
      });
    }

    const coldRoom = new ColdRoom({
      ...req.body,
      currentLoadKg: req.body.currentLoadKg || 0,
    });

    await coldRoom.save();

    res.status(201).json({
      success: true,
      message: "Komora je uspešno kreirana.",
      data: coldRoom,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      return res.status(400).json({
        success: false,
        message: "Neuspela validacija.",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Neuspešno kreiranje komore.",
      error: error.message,
    });
  }
};

export const updateColdRoom = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Broj komore nije validan ID format.",
      });
    }

    if (req.body.roomNumber) {
      return res.status(400).json({
        success: false,
        message: "Komora ne može biti promenjena.",
      });
    }

    const coldRoom = await ColdRoom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!coldRoom) {
      return res.status(404).json({
        success: false,
        message: "Komora nije pronadjena.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Komora uspešno promenjena.",
      data: coldRoom,
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
      message: "Neuspešna izmena komore.",
      error: error.message,
    });
  }
};

export const deleteColdRoom = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Nevalidni broj komore",
      });
    }

    const coldRoomInUse = await Product.exists({
      "coldRooms.coldRoom": req.params.id,
    });
    if (coldRoomInUse) {
      return res.status(400).json({
        success: false,
        message: "Nemoguće je izbrisati komoru sa dodeljenim proizvodima.",
      });
    }

    const coldRoom = await ColdRoom.findByIdAndDelete(req.params.id);
    if (!coldRoom) {
      return res.status(404).json({
        success: false,
        message: "Komora nije pronadjena.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Komora uspešno obrisana.",
      data: {
        id: coldRoom._id,
        roomNumber: coldRoom.roomNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Neuspešno brisanje komore.",
      error: error.message,
    });
  }
};
