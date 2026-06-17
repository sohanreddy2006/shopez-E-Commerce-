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
  },
  {
    title: 'Bluetooth Soundbar Speaker',
    description: 'Slim 24-inch soundbar with deep bass, Bluetooth 5.3, HDMI ARC, and wall-mount kit for an immersive home audio experience.',
    brand: 'Aurora',
    category: 'Electronics',
    price: 6999,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=80',
    stock: 19,
    colors: ['Black'],
    rating: 4.5,
    numReviews: 23,
    isFeatured: true
  },
  {
    title: 'USB-C Hub Multiport Adapter',
    description: 'Seven-in-one USB-C hub with 4K HDMI, SD card reader, USB 3.0 ports, and 100W power delivery for laptops and tablets.',
    brand: 'DigiGear',
    category: 'Electronics',
    price: 1899,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=1200&q=80',
    stock: 47,
    rating: 4.3,
    numReviews: 14
  },
  {
    title: 'Wireless Charging Station',
    description: 'Three-in-one fast charger for phone, earbuds, and smartwatch with LED indicator and anti-slip base.',
    brand: 'PulseOne',
    category: 'Electronics',
    price: 2599,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?auto=format&fit=crop&w=1200&q=80',
    stock: 36,
    colors: ['White', 'Black'],
    rating: 4.4,
    numReviews: 19
  },
  {
    title: 'Mechanical Gaming Keyboard',
    description: 'Full-size mechanical keyboard with blue switches, per-key RGB, aluminium frame, and detachable USB-C cable.',
    brand: 'DigiGear',
    category: 'Electronics',
    price: 4499,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80',
    stock: 28,
    colors: ['Black', 'White'],
    rating: 4.7,
    numReviews: 42,
    isFeatured: true
  },
  {
    title: 'Portable Bluetooth Speaker',
    description: 'Waterproof IPX7 speaker with 360-degree sound, 20-hour battery, and built-in microphone for calls and outdoor use.',
    brand: 'Aurora',
    category: 'Electronics',
    price: 2999,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=80',
    stock: 53,
    colors: ['Blue', 'Red', 'Black'],
    rating: 4.2,
    numReviews: 31
  },
  {
    title: 'Slim Leather Bifold Wallet',
    description: 'Genuine leather bifold wallet with RFID protection, eight card slots, a clear ID window, and a slim profile.',
    brand: 'ModeStreet',
    category: 'Fashion',
    price: 1299,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80',
    stock: 62,
    colors: ['Brown', 'Black'],
    rating: 4.5,
    numReviews: 27
  },
  {
    title: 'Classic Aviator Sunglasses',
    description: 'UV400 protective aviator sunglasses with a lightweight metal frame, adjustable nose pads, and scratch-resistant lenses.',
    brand: 'ModeStreet',
    category: 'Fashion',
    price: 2499,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80',
    stock: 41,
    colors: ['Gold', 'Silver'],
    rating: 4.6,
    numReviews: 33,
    isFeatured: true
  },
  {
    title: 'Casual Canvas Sneakers',
    description: 'Comfortable lace-up canvas sneakers with cushioned insole, rubber outsole, and breathable lining for everyday wear.',
    brand: 'NorthTrail',
    category: 'Fashion',
    price: 1799,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80',
    stock: 55,
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['White', 'Navy'],
    rating: 4.3,
    numReviews: 38
  },
  {
    title: 'Premium Cotton T-Shirt Pack',
    description: 'Pack of three premium combed-cotton t-shirts with a regular fit, reinforced collar, and pre-shrunk fabric.',
    brand: 'ModeStreet',
    category: 'Fashion',
    price: 1599,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    stock: 88,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Grey'],
    rating: 4.4,
    numReviews: 45
  },
  {
    title: 'Denim Jean Jacket',
    description: 'Classic denim jacket with button closure, chest pockets, adjustable waist tabs, and a timeless wash that goes with everything.',
    brand: 'NorthTrail',
    category: 'Fashion',
    price: 3499,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80',
    stock: 23,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Light Blue', 'Dark Blue'],
    rating: 4.6,
    numReviews: 29,
    isFeatured: true
  },
  {
    title: 'Scented Soy Candle Set',
    description: 'Set of three hand-poured soy wax candles in lavender, vanilla, and sandalwood with cotton wicks for a warm, natural glow.',
    brand: 'CasaWare',
    category: 'Home',
    price: 899,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80',
    stock: 76,
    rating: 4.7,
    numReviews: 52,
    isFeatured: true
  },
  {
    title: 'Bamboo Storage Shelves',
    description: 'Modular bamboo shelving unit with three tiers, wall-mountable or freestanding, perfect for plants, books, and decor.',
    brand: 'CasaWare',
    category: 'Home',
    price: 4599,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=1200&q=80',
    stock: 14,
    colors: ['Natural Bamboo'],
    rating: 4.5,
    numReviews: 18
  },
  {
    title: 'Cotton Bed Sheet Set',
    description: '400-thread-count cotton bed sheet set with a flat sheet, fitted sheet, and two pillowcases in a breathable sateen weave.',
    brand: 'CasaWare',
    category: 'Home',
    price: 2799,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
    stock: 34,
    colors: ['White', 'Beige', 'Blue'],
    rating: 4.4,
    numReviews: 25
  },
  {
    title: 'Stainless Steel Cookware Set',
    description: 'Ten-piece stainless steel cookware set including pots, pans, lids, and utensils with even heat distribution and stay-cool handles.',
    brand: 'CasaWare',
    category: 'Home',
    price: 8999,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
    stock: 9,
    rating: 4.8,
    numReviews: 41,
    isFeatured: true
  },
  {
    title: 'Glass Food Storage Containers',
    description: 'Set of five borosilicate glass containers with airtight bamboo lids, leak-proof, oven and microwave safe for meal prep.',
    brand: 'CasaWare',
    category: 'Home',
    price: 1999,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=1200&q=80',
    stock: 45,
    rating: 4.3,
    numReviews: 22
  },
  {
    title: 'Vitamin C Brightening Serum',
    description: 'Concentrated vitamin C serum with hyaluronic acid and vitamin E for brightening, hydration, and even skin tone.',
    brand: 'LumaCare',
    category: 'Beauty',
    price: 849,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80',
    stock: 91,
    rating: 4.5,
    numReviews: 48,
    isFeatured: true
  },
  {
    title: 'Matte Liquid Lipstick Duo',
    description: 'Set of two long-wear matte liquid lipsticks in universally flattering nude and rose shades with a creamy, non-drying formula.',
    brand: 'LumaCare',
    category: 'Beauty',
    price: 649,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=80',
    stock: 67,
    colors: ['Nude', 'Rose'],
    rating: 4.2,
    numReviews: 35
  },
  {
    title: 'Hair Repair Shampoo & Conditioner',
    description: 'Sulphate-free repair shampoo and conditioner duo enriched with argan oil and keratin for damaged, dry hair.',
    brand: 'LumaCare',
    category: 'Beauty',
    price: 1299,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=80',
    stock: 58,
    rating: 4.6,
    numReviews: 39
  },
  {
    title: 'Fragrance Gift Set',
    description: 'Eau de parfum gift set with three travel-friendly fragrances — citrus, floral, and woody — in a premium gift box.',
    brand: 'LumaCare',
    category: 'Beauty',
    price: 2199,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
    stock: 29,
    rating: 4.7,
    numReviews: 31,
    isFeatured: true
  },
  {
    title: 'Adjustable Dumbbell Set',
    description: 'Space-saving adjustable dumbbells from 2 kg to 20 kg with a quick-turn dial mechanism and ergonomic grip handles.',
    brand: 'CoreFlex',
    category: 'Sports',
    price: 12499,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    stock: 7,
    rating: 4.8,
    numReviews: 26,
    isFeatured: true
  },
  {
    title: 'Insulated Gym Water Bottle',
    description: 'Double-wall vacuum insulated stainless steel bottle, 750 ml capacity, with a leak-proof cap and carry loop.',
    brand: 'CoreFlex',
    category: 'Sports',
    price: 899,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80',
    stock: 84,
    colors: ['Black', 'Silver', 'Teal'],
    rating: 4.4,
    numReviews: 33
  },
  {
    title: 'Resistance Bands Set',
    description: 'Set of five latex resistance bands with different tension levels, door anchor, and carry bag for home strength training.',
    brand: 'CoreFlex',
    category: 'Sports',
    price: 599,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=1200&q=80',
    stock: 95,
    rating: 4.3,
    numReviews: 44
  },
  {
    title: 'Running Shoes with Cushion Sole',
    description: 'Lightweight running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole for road and trail.',
    brand: 'NorthTrail',
    category: 'Sports',
    price: 4999,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    stock: 31,
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Blue', 'Red', 'Black'],
    rating: 4.5,
    numReviews: 37,
    isFeatured: true
  },
  {
    title: 'The Art of Code: Clean Programming',
    description: 'A practical guide to writing maintainable, readable, and efficient code with real-world examples and exercises for modern developers.',
    brand: 'TechPress',
    category: 'Books',
    price: 799,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=80',
    stock: 50,
    rating: 4.7,
    numReviews: 56,
    isFeatured: true
  },
  {
    title: 'Design Thinking Handbook',
    description: 'An illustrated guide to human-centred design, prototyping, and innovation methods for product teams and creative problem solvers.',
    brand: 'TechPress',
    category: 'Books',
    price: 649,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    stock: 38,
    rating: 4.5,
    numReviews: 29
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
    categories: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books']
  });

  console.log('Seed data imported successfully');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
