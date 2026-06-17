import asyncHandler from '../middleware/asyncHandler.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const itemNetPrice = (item) => item.price - (item.price * item.discount) / 100;

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, productRequirements } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    if (!product || product.stock < item.quantity) {
      res.status(400);
      throw new Error(`${item.title} is no longer available in the requested quantity`);
    }

    product.stock -= item.quantity;
    await product.save();
  }

  const itemsPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountPrice = cart.items.reduce(
    (total, item) => total + ((item.price * item.discount) / 100) * item.quantity,
    0
  );
  const subtotal = cart.items.reduce((total, item) => total + itemNetPrice(item) * item.quantity, 0);
  const shippingPrice = subtotal > 999 ? 0 : 49;
  const totalPrice = subtotal + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems: cart.items.map((item) => item.toObject()),
    shippingAddress,
    paymentMethod,
    productRequirements,
    itemsPrice,
    discountPrice,
    shippingPrice,
    totalPrice,
    isPaid: paymentMethod !== 'Cash on Delivery',
    paidAt: paymentMethod !== 'Cash on Delivery' ? new Date() : undefined
  });

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You are not authorized to view this order');
  }

  res.json(order);
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = req.body.status || order.status;
  order.deliveredAt = order.status === 'Delivered' ? new Date() : order.deliveredAt;
  const savedOrder = await order.save();
  res.json(savedOrder);
});
