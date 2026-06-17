import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const userPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  address: user.address,
  token: createToken(user._id)
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password, phone });
  res.status(201).json(userPayload(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json(userPayload(user));
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
    address: req.user.address
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  user.address = req.body.address ?? user.address;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const savedUser = await user.save();
  res.json(userPayload(savedUser));
});
