import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/Product.js';
import Wishlist from '../models/Wishlist.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  res.json(wishlist ? wishlist.items : []);
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }

  const existingIndex = wishlist.items.findIndex(
    (item) => item.product.toString() === req.params.productId
  );

  if (existingIndex > -1) {
    wishlist.items.splice(existingIndex, 1);
    await wishlist.save();
    res.json({ inWishlist: false, items: wishlist.items });
  } else {
    wishlist.items.push({
      product: product._id,
      title: product.title,
      image: product.image,
      price: product.price,
      discount: product.discount
    });
    await wishlist.save();
    res.json({ inWishlist: true, items: wishlist.items });
  }
});

export const checkWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  const inWishlist = wishlist
    ? wishlist.items.some((item) => item.product.toString() === req.params.productId)
    : false;

  res.json({ inWishlist });
});
