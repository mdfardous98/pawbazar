# 🐾 PawBazar — Pet Adoption & Supply Portal

Industry-grade Full-Stack React Application

## 📌 Project Overview

PawBazar is a community-driven, full-stack web platform that enables:

- Pet adoption (free listings)
- Pet product sales (food, accessories, care items)
- Secure user authentication
- Role-based private actions (add listing, order, dashboard)

The platform is publicly viewable, but ordering/adoption requires authentication.
This project is designed to meet professional portfolio, freelance, and real-world SaaS standards.

## 🌐 Live & Repository Information

### 🔗 Client Repository

- **GitHub:** https://github.com/mdfardous98/pawbazar
- **Live Site:** (Netlify / Firebase Hosting)

### 🔗 Server Repository

- **GitHub:** https://github.com/mdfardous98/pawbazar
- **Live API:** (Vercel)

## 👤 Developer Information

- **Name:** MD Fardous
- **Location:** 📍 Dhaka, Bangladesh
- **Email:** 📧 mdjfardous@gmail.com
- **Phone:** 📱 +8801688645882

### 🔗 Social Links

- **GitHub:** https://github.com/mdfardous98
- **LinkedIn:** https://www.linkedin.com/in/mdfardous
- **Facebook:** https://www.facebook.com/tajwar.fardous

## 🧱 Tech Stack

### Frontend (Client)

- React (Vite)
- React Router DOM
- Tailwind CSS
- DaisyUI
- Firebase Authentication
- Axios
- React Hot Toast / SweetAlert
- jsPDF + jsPDF-AutoTable
- Framer Motion / React Tooltip / React Simple Typewriter

### Backend (Server)

- Node.js
- Express.js
- MongoDB Atlas
- Firebase Admin SDK
- JWT (via Firebase token verification)
- CORS
- Dotenv

## 🔐 Authentication (Firebase)

### Firebase Project

- **Project Name:** pawbazar
- **Project ID:** pawbazar-e4373

### Auth Providers:

- Email & Password ✅
- Google Login ✅

### Rules

- Anyone can view listings and details
- Only authenticated users can:
  - Add listings
  - Place orders
  - View dashboards
- Logged-in users must not be redirected to login on reload
- Private routes remain protected after refresh

## 🗄 Database Structure (MongoDB)

### 📁 Collection: listings

```json
{
  "name": "Golden Retriever Puppy",
  "category": "Pets",
  "price": 0,
  "location": "Dhaka",
  "description": "Friendly 2-month-old puppy available for adoption.",
  "image": "https://example.com/image.jpg",
  "email": "owner@gmail.com",
  "date": "2025-10-27"
}
```

### 📁 Collection: orders

```json
{
  "productId": "65488adsfadf5454f",
  "productName": "Golden Retriever Puppy",
  "buyerName": "Mr. X",
  "email": "buyer@gmail.com",
  "quantity": 1,
  "price": 0,
  "address": "Chattogram",
  "phone": "017xxxxxxxx",
  "date": "2025-10-27",
  "additionalNotes": "Some text"
}
```

## 🧭 Application Layout

### Navbar

**Before Login**

- Logo + Site Name
- Home
- Pets & Supplies
- Login
- Register

**After Login**

- Home
- Pets & Supplies
- Add Listing
- My Listings
- My Orders
- Profile Dropdown
- Logout

✔ Sticky ✔ Responsive ✔ Same style across all pages

### Footer

- Logo / Site Name
- Short description
- Useful links
- Copyright
- Social links

❌ Footer & Navbar must not appear on 404 page

## 🏠 Pages & Features

### Home Page (Public)

- Hero carousel (3+ real images)
- Category section (4 categories)
- Recent listings (limit 6 from DB)
- Awareness section (Adopt, Don't Shop)
- Community section
- Minimum 10 meaningful sections

### Pets & Supplies Page (Public)

- Grid layout (equal height cards)
- Search by name
- Filter by category
- Sort options
- Pagination or infinite scroll
- Skeleton loaders

### Listing Details Page (Public View)

- Full details
- Multiple images
- Related items
- "Adopt / Order Now" button
- ➡ Clicking order requires login

### Add Listing Page (Private)

- Fully validated form
- Saves to MongoDB
- Toast success/error
- Owner email auto-filled

### Order Modal (Private)

- Auto-filled user data
- Quantity logic (pets = 1)
- Save order to DB
- Success toast

### My Listings (Dashboard – Private)

- Only user's listings
- Table view
- Edit (modal or route)
- Delete with confirmation

### My Orders (Dashboard – Private)

- Only user's orders
- Table view
- Download PDF report (jsPDF)

### Authentication Pages

- Login
- Register
- Google login
- Password validation
- No default alerts
- No lorem text

## 📊 Dashboard Requirements

- Dedicated layout
- Sidebar + top navbar
- Profile page
- Charts using real data
- Overview cards
- Role-based access (admin optional)

## 🎨 UI / UX Rules (Strict)

- Max 3 primary colors
- Light/Dark mode
- No placeholder content
- Equal card sizes
- Professional spacing & typography
- Mobile-first responsive
- New X logo, not Twitter bird

## 🚀 Deployment Rules

- **Client:** Netlify / Firebase Hosting
- **Server:** Vercel
- Firebase authorized domains configured
- SPA reload must not break routes

## 📌 GitHub Commit Rules (Mandatory)

### Client Side

- 30+ meaningful commits
- Feature-based commits
- No "final commit" garbage

### Server Side

- 30+ meaningful commits
- Auth, CRUD, middleware separated

## 📦 Submission Checklist

- ✅ Client GitHub Repo
- ✅ Server GitHub Repo
- ✅ Live Client URL
- ✅ Live Server URL
- ✅ README.md (this file)
