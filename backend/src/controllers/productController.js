import asyncHandler from '../middleware/asyncHandler.js';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';

export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sort = 'featured', page = 1, limit = 12 } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } }
    ];
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  const sortMap = {
    featured: { isFeatured: -1, createdAt: -1 },
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { rating: -1 }
  };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortMap[sort] || sortMap.featured).skip(skip).limit(limitNum),
    Product.countDocuments(query)
  ]);

  res.json({
    products,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total
  });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(6).sort({ createdAt: -1 });
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  await syncCategory(product.category);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  Object.assign(product, req.body);
  const savedProduct = await product.save();
  await syncCategory(savedProduct.category);
  res.json(savedProduct);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.some(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You already reviewed this product');
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  });

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((total, review) => total + review.rating, 0) / product.numReviews;

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

const syncCategory = async (category) => {
  if (!category) return;

  await Admin.findOneAndUpdate(
    {},
    { $addToSet: { categories: category } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};
