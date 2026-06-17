import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Admin from '../models/Admin.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();
await connectDB();

const users = [
  {
    name: 'Sohan Reddy',
    email: 'user@shopez.com',
    password: 'password123',
    phone: '9876543210',
    role: 'user',
    address: {
      line1: '14 Lake View Road',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500081',
      country: 'India'
    }
  },
  {
    name: 'ShopEZ Admin',
    email: 'admin@shopez.com',
    password: 'admin123',
    phone: '9000011111',
    role: 'admin'
  }
];

const products = [
  {
    title: 'Aurora Wireless Headphones',
    description:
      'Noise-isolating over-ear headphones with 40-hour battery life, plush cushions, and rich bass for work, travel, and music.',
    brand: 'Aurora',
    category: 'Electronics',
    price: 3999,
    discount: 18,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    stock: 24,
    colors: ['Midnight', 'Silver'],
    rating: 4.6,
    numReviews: 18,
    isFeatured: true
  },
  {
    title: 'Everyday Smartwatch Pro',
    description:
      'A lightweight smartwatch with activity tracking, call alerts, sleep insights, and a bright always-on display.',
    brand: 'PulseOne',
    category: 'Electronics',
    price: 5499,
    discount: 12,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    stock: 31,
    colors: ['Black', 'Rose Gold'],
    rating: 4.4,
    numReviews: 26,
    isFeatured: true
  },
  {
    title: 'Urban Travel Backpack',
    description:
      'Water-resistant backpack with laptop padding, easy-access organizer pockets, and a structured silhouette for daily travel.',
    brand: 'NorthTrail',
    category: 'Fashion',
    price: 2299,
    discount: 20,
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    stock: 42,
    colors: ['Olive', 'Charcoal'],
    rating: 4.7,
    numReviews: 34,
    isFeatured: true
  },
  {
    title: 'Cotton Lounge Hoodie',
    description:
      'Soft fleece hoodie made for relaxed evenings, campus days, and casual outings. Includes kangaroo pocket and ribbed cuffs.',
    brand: 'ModeStreet',
    category: 'Fashion',
    price: 1799,
    discount: 15,
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80',
    stock: 58,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Grey'],
    rating: 4.3,
    numReviews: 21
  },
  {
    title: 'Ceramic Dinner Set',
    description:
      'Sixteen-piece ceramic dinner set with dinner plates, quarter plates, bowls, and mugs in a clean matte finish.',
    brand: 'CasaWare',
    category: 'Home',
    price: 3199,
    discount: 10,
    image:
      'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1200&q=80',
    stock: 17,
    colors: ['Ivory', 'Sage'],
    rating: 4.5,
    numReviews: 12,
    isFeatured: true
  },
  {
    title: 'Glow Daily Skincare Kit',
    description:
      'A gentle skincare set with cleanser, toner, moisturizer, and SPF for a simple morning routine.',
    brand: 'LumaCare',
    category: 'Beauty',
    price: 1499,
    discount: 8,
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    stock: 64,
    rating: 4.2,
    numReviews: 16
  },
  {
    title: 'CoreFlex Yoga Mat',
    description:
      'Non-slip 6mm yoga mat with alignment guides, extra cushioning, and a carry strap for home or studio sessions.',
    brand: 'CoreFlex',
    category: 'Sports',
    price: 999,
    discount: 5,
    image:
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=1200&q=80',
    stock: 73,
    colors: ['Teal', 'Plum'],
    rating: 4.6,
    numReviews: 29
  },
  {
    title: 'Compact Espresso Maker',
    description:
      'Countertop espresso maker with a pressure gauge, milk wand, removable tank, and quick preheat for cafe-style coffee.',
    brand: 'BrewNest',
    category: 'Home',
    price: 7499,
    discount: 22,
    image:
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1200&q=80',
    stock: 11,
    colors: ['Steel', 'Black'],
    rating: 4.8,
    numReviews: 37,
    isFeatured: true
  }
];

const seed = async () => {
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
    Admin.deleteMany({})
  ]);

  for (const user of users) {
    await User.create(user);
  }
  await Product.insertMany(products);
  await Admin.create({
    bannerTitle: 'ShopEZ: discover, cart, checkout',
    bannerSubtitle:
      'Find detailed products, compare discounts, place secure orders, and review every confirmation in your profile.',
    bannerImage:
      'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1600&q=80',
    categories: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports']
  });

  console.log('Seed data imported successfully');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
