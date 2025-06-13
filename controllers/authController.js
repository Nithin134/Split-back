import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Please provide all required fields' });

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: 'User already exists with this email' });

  const user = new User({ name, email, phone, password });
  await user.save();

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    token: generateToken(user._id),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Please provide email and password' });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: 'Invalid email or password' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.status(401).json({ message: 'Invalid email or password' });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    token: generateToken(user._id),
  });
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
