import asyncHandler from '../middleware/asyncHandler.js';
import Admin from '../models/Admin.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getAdminSettings = asyncHandler(async (req, res) => {
  const settings = await Admin.findOneAndUpdate(
    {},
    {
      $setOnInsert: {
        categories: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports']
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json(settings);
});

export const updateAdminSettings = asyncHandler(async (req, res) => {
  const settings = await Admin.findOneAndUpdate({}, req.body, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  });

  res.json(settings);
});

export const getAdminSummary = asyncHandler(async (req, res) => {
  const [users, products, orders, revenue, latestOrders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.find({}).populate('user', 'name email').sort({ createdAt: -1 }).limit(5)
  ]);

  res.json({
    users,
    products,
    orders,
    revenue: revenue[0]?.total || 0,
    latestOrders
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});
