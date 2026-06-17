import asyncHandler from '../middleware/asyncHandler.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json(cart);
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, selectedSize, productNote } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Requested quantity is not available');
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      (item.selectedSize || '') === (selectedSize || '') &&
      (item.productNote || '') === (productNote || '')
  );

  if (existingItem) {
    const nextQuantity = existingItem.quantity + Number(quantity);

    if (product.stock < nextQuantity) {
      res.status(400);
      throw new Error('Requested quantity is not available');
    }

    existingItem.quantity = nextQuantity;
  } else {
    cart.items.push({
      product: product._id,
      title: product.title,
      image: product.image,
      price: product.price,
      discount: product.discount,
      quantity: Number(quantity),
      selectedSize,
      productNote
    });
  }

  const savedCart = await cart.save();
  res.status(201).json(savedCart);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);

  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  const product = await Product.findById(item.product);
  const nextQuantity = Math.max(1, Number(quantity));

  if (!product || product.stock < nextQuantity) {
    res.status(400);
    throw new Error('Requested quantity is not available');
  }

  item.quantity = nextQuantity;
  const savedCart = await cart.save();
  res.json(savedCart);
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
  const savedCart = await cart.save();
  res.json(savedCart);
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  const savedCart = await cart.save();
  res.json(savedCart);
});
