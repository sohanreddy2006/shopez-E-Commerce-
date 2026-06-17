import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    bannerTitle: { type: String, default: 'Shop smarter with ShopEZ' },
    bannerSubtitle: {
      type: String,
      default: 'Discover curated products, simple checkout, and secure ordering.'
    },
    bannerImage: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80'
    },
    categories: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
