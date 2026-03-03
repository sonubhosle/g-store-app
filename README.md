# G-Store 🛒

A full-stack modern e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). 
G-Store provides a complete shopping experience with features like user authentication, product management, shopping cart, order tracking, razorpay integration, and a full admin dashboard.

---

## 🌟 Features

### 🛍️ User Features
- **Authentication**: JWT-based login, signup, forgot/reset password.
- **Product Discovery**: Search with live suggestions, category filtering, and detailed product pages.
- **Cart & Wishlist**: Manage items you want to buy or save for later.
- **Checkout**: Seamless checkout flow with Razorpay integration.
- **Order Management**: View order history, track current orders, and manage saved addresses.
- **Ratings & Reviews**: Rate products and write text reviews with an average score breakdown.
- **User Profile**: Update profile details and upload an avatar photo.

### 🛡️ Admin Features
- **Dashboard Overview**: Track sales, revenue, and active orders.
- **Product Management**: Add, edit, delete, and restock products.
- **Order Management**: Update order statuses (Pending, Confirmed, Shipped, Delivered, Cancelled).
- **User Management**: View all registered users and manage their accounts.

---

## 🛠️ Tech Stack

**Frontend (`g-store/`)**
- React 18 + Vite
- Redux Thunk (State Management)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Lucide React (Icons)
- React Router DOM (Routing)
- Axios (API Calls)

**Backend (`backend/`)**
- Node.js + Express.js
- MongoDB + Mongoose
- Cloudinary (Image Uploads)
- Razorpay (Payment Gateway)
- JWT (Authentication)
- Nodemailer (Email services for password reset)

---

## 🚀 Step-by-Step Setup Guide

### 1. Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- A [Cloudinary](https://cloudinary.com/) account (for image uploads)
- A [Razorpay](https://razorpay.com/) account (for test payments)
- A Gmail App Password (for Nodemailer)

---

### 2. Clone the Repository
```bash
git clone <your-repo-url>
cd G-Store
```

---

### 3. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the `backend/` directory and add the following keys:
   ```env
   # Server Port
   PORT=8585
   
   # Frontend URL (For CORS and Email Links)
   FRONTEND_URL=http://localhost:5173
   
   # MongoDB Connection String
   DB_URL=mongodb://localhost:27017/g-store
   
   # JWT Secret Key
   SECRET_KEY=your_super_secret_jwt_key
   
   # Cloudinary Credentials (for product/profile images)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Razorpay Credentials (for payments)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Email Configuration (for Nodemailer/Forgot Password)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   *The server should now be running on `http://localhost:8585`*

---

### 4. Frontend Setup

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd g-store
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Check API Configuration:**
   Ensure the `src/config/apiConfig.js` file points to your backend URL:
   ```javascript
   export const API_BASE_URL = "http://localhost:8585";
   ```

4. **Start the frontend server:**
   ```bash
   npm run dev
   ```
   *The React app should now be running on `http://localhost:5173`*

---

## 🔑 Default Admin Account
To access the Admin Dashboard, you can register a new user normally, then manually change their `role` to `ADMIN` inside your MongoDB database (`users` collection).

Alternatively, you can seed an admin user or use a pre-existing one.

---

## 📦 Folder Structure

```
G-Store/
├── backend/               # Express & MongoDB Backend
│   ├── config/            # DB, Razorpay, Cloudinary config
│   ├── controllers/       # Route controllers
│   ├── middleware/        # JWT Auth & Error handlers
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express API routes
│   └── services/          # Business logic & DB queries
│
└── g-store/               # React Frontend
    ├── public/            # Static assets
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── config/        # API configuration
    │   ├── Pages/         # Full page layouts (Home, Cart, Admin, etc.)
    │   ├── states/        # Redux actions and reducers
    │   ├── App.jsx        # Main router
    │   └── index.css      # Tailwind imports
```

---

## ✨ Available Scripts

### Backend (`/backend`)
- `npm run dev`: Starts the backend server using nodemon for automatic restarts.
- `npm start`: Starts the backend server directly with node.

### Frontend (`/g-store`)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build locally.
