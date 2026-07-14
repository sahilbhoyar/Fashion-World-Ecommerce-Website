# Fashion World

A modern e-commerce website for the **Fashion World** clothing brand. Built with React, Vite, and Tailwind CSS.

## Features

- **Homepage** — Hero banner, category sections, featured products, and new arrivals
- **Shop** — Browse all products with category and "new only" filters
- **Product Detail** — Size, color, and quantity selection with add-to-cart
- **Shopping Cart** — Persistent cart (localStorage), quantity controls, order summary
- **Responsive Design** — Works on mobile, tablet, and desktop

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- React 18
- Vite 5
- React Router 6
- Tailwind CSS 3

## Project Structure

```
src/
├── components/     # Navbar, Footer, ProductCard
├── context/        # Cart state management
├── data/           # Product catalog
├── pages/          # Home, Shop, ProductDetail, Cart
├── App.jsx
├── main.jsx
└── index.css
```
