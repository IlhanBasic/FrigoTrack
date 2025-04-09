import ColdRoom from "../models/coldRoom.model.js";

export const getAllColdRooms = async (req, res) => {
  try {
    const coldRooms = await ColdRoom.find();
    res.status(200).json(coldRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getColdRoomById = async (req, res) => {
  try {
    const coldRoom = await ColdRoom.findById(req.params.id);
    if (!coldRoom) {
      return res.status(404).json({ message: "Cold room not found." });
    }
    res.status(200).json(coldRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createColdRoom = async (req, res) => {
  const { roomNumber, temperature, capacityKg,location,type } = req.body;
  if (!roomNumber || !temperature || !capacityKg || !location || !type) {
    return res.status(400).json({ message: "Required fields are missing: roomNumber, temperature, capacityKg, location, type." });
  }

  try {
    const existingColdRoom = await ColdRoom.findOne({ roomNumber });
    if (existingColdRoom) {
      return res.status(400).json({ message: "Cold room with this room number already exists." });
    }

    const coldRoom = new ColdRoom(req.body);
    await coldRoom.save();
    res.status(201).json(coldRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateColdRoom = async (req, res) => {
  try {
    const coldRoom = await ColdRoom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!coldRoom) {
      return res.status(404).json({ message: "Cold room not found." });
    }
    res.status(200).json(coldRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteColdRoom = async (req, res) => {
  try {
    const coldRoom = await ColdRoom.findByIdAndDelete(req.params.id);
    if (!coldRoom) {
      return res.status(404).json({ message: "Cold room not found." });
    }
    res.status(200).json({ message: "Cold room deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};