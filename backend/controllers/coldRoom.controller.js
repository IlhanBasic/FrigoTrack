import ColdRoom from "../models/coldRoom.model.js";
import mongoose from "mongoose";

const validateColdRoomData = (data) => {
  const errors = {};

  if (!data.roomNumber || typeof data.roomNumber !== "string") {
    errors.roomNumber = "Valid room number is required";
  }

  if (data.temperature === undefined || typeof data.temperature !== "number") {
    errors.temperature = "Valid temperature value is required";
  } else if (data.temperature > 0) {
    errors.temperature = "Temperature must be below 0°C for cold rooms";
  }

  if (
    data.capacityKg === undefined ||
    typeof data.capacityKg !== "number" ||
    data.capacityKg <= 0
  ) {
    errors.capacityKg = "Valid capacity in kg is required";
  }

  if (!data.location || typeof data.location !== "string") {
    errors.location = "Valid location is required";
  }

  if (!data.type || !["standard", "shock freezer"].includes(data.type)) {
    errors.type = "Valid type (standard or shock freezer) is required";
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
      message: "Failed to retrieve cold rooms",
      error: error.message,
    });
  }
};

export const getColdRoomById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cold room ID format",
      });
    }

    const coldRoom = await ColdRoom.findById(req.params.id);
    if (!coldRoom) {
      return res.status(404).json({
        success: false,
        message: "Cold room not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: coldRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cold room",
      error: error.message,
    });
  }
};

export const createColdRoom = async (req, res) => {
  const validationErrors = validateColdRoomData(req.body);
  if (validationErrors) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
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
        message: "Cold room with this room number already exists.",
      });
    }

    const coldRoom = new ColdRoom({
      ...req.body,
      currentLoadKg: req.body.currentLoadKg || 0,
    });

    await coldRoom.save();

    res.status(201).json({
      success: true,
      message: "Cold room created successfully",
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
        message: "Validation failed",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create cold room",
      error: error.message,
    });
  }
};

export const updateColdRoom = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cold room ID format",
      });
    }

    if (req.body.roomNumber) {
      return res.status(400).json({
        success: false,
        message: "Room number cannot be changed",
      });
    }

    const coldRoom = await ColdRoom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!coldRoom) {
      return res.status(404).json({
        success: false,
        message: "Cold room not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cold room updated successfully",
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
        message: "Validation failed",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update cold room",
      error: error.message,
    });
  }
};

export const deleteColdRoom = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cold room ID format",
      });
    }

    const coldRoomInUse = await Product.exists({
      "coldRooms.coldRoom": req.params.id,
    });
    if (coldRoomInUse) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete cold room with assigned products",
      });
    }

    const coldRoom = await ColdRoom.findByIdAndDelete(req.params.id);
    if (!coldRoom) {
      return res.status(404).json({
        success: false,
        message: "Cold room not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cold room deleted successfully.",
      data: {
        id: coldRoom._id,
        roomNumber: coldRoom.roomNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete cold room",
      error: error.message,
    });
  }
};
