# ShopEZ MERN E-commerce Application

ShopEZ is a full-stack MERN application for browsing products, managing a cart, placing orders, and administering product/order data.

## Tech Stack

- Frontend: React, React Router, Bootstrap, Axios
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB
- Security: JWT authentication, bcrypt password hashing, role-based admin routes

## Quick Start

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Create `backend/.env` from `backend/.env.example` and update MongoDB settings if needed.

3. Seed demo users and products:

   ```bash
   npm run seed
   ```

4. Start both servers:

   ```bash
   npm run dev
   ```

The API runs on `http://localhost:5000` and the React app runs on `http://localhost:5173`.

## Demo Accounts

- User: `user@shopez.com` / `password123`
- Admin: `admin@shopez.com` / `admin123`

## Main Features

- User registration and login
- Product catalog with search, categories, reviews, prices, discounts, and stock status
- Cart with quantity updates and removals
- Checkout with shipping address, payment method, and product notes
- Order confirmation and profile order history
- Admin dashboard for products, orders, users, banner image, and categories
- Protected routes and role-based authorization

