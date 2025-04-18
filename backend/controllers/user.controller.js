import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronadjen." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronadjen." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  handleValidationErrors(req, res);

  const { username, email, password, department, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email već postoji." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      department,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Korisničko ime ne postoji." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Šifra nije ispravna." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      message: "Login uspešan.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLoggedInUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Nije prijavljen." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronadjen." });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(403).json({ message: "Nevalidan token." });
  }
};
export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout uspešan." });
};
export const updateUser = async (req, res) => {
  handleValidationErrors(req, res);

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronadjen." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronadjen." });
    }
    res.status(200).json({ message: "Korisnik obrisan uspešno." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteAllUser = async (req, res) => {
  try {
    const deletedUsers = await User.deleteMany({});
    res
      .status(200)
      .json({
        message: `${deletedUsers.deletedCount} korisnik/a je uspešno obrisan/o.`,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
