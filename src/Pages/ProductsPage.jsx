import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { products as allProducts } from "../data/products";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import "./ProductsPage.css";

const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: '📦' },
  { id: 'Smartphones', name: 'Smartphones', icon: '📱' },
  { id: 'Laptops', name: 'Laptops', icon: '💻' },
  { id: 'Audio', name: 'Audio', icon: '🎧' },
  { id: 'Gaming', name: 'Gaming', icon: '🎮' },
  { id: 'Wearables', name: 'Wearables', icon: '⌚' },
  { id: 'Accessories', name: 'Accessories', icon: '🔌' },
];

export default function ProductsPage() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="products-page">
      {/* Navigation */}
      <nav className={`lp-nav ${navScrolled ? "lp-nav--scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <button 
            className="lp-nav-hamburger" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="lp-nav-logo" onClick={() => navigate('/')}>MAISON</div>

          <div className="lp-nav-actions">
            <button className="lp-nav-signin" onClick={() => navigate('/login')}>Sign In</button>
            <button className="lp-nav-cart desktop-only" onClick={() => setCartOpen(true)}>
              Cart ({itemCount})
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div 
            className="lp-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>Home</button>
            <button onClick={() => { setSelectedCategory('all'); setMobileMenuOpen(false); }}>All Products</button>
            <button onClick={() => navigate('/login')}>Sign In</button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="products-hero">
        <div className="products-hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            All <span className="gradient-text">Products</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Browse our complete collection of premium tech
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="category-filter">
        <div className="category-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-grid-section">
        <div className="products-count">
          Showing {filteredProducts.length} products
        </div>
        
        <div className="lp-products-grid">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found in this category.</p>
            <button className="lp-btn-outline" onClick={() => setSelectedCategory('all')}>
              View All Products
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-content">
          <div className="lp-footer-logo">MAISON</div>
          <div className="lp-footer-links">
            <button onClick={() => navigate('/')}>Home</button>
            <button onClick={() => setSelectedCategory('all')}>Products</button>
            <button onClick={() => navigate('/login')}>Sign In</button>
          </div>
          <p className="lp-footer-text">© 2024 MAISON. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Cart */}
      <motion.button
        className="lp-floating-cart"
        onClick={() => setCartOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 6h15l-1.5 9h-12z" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
          <path d="M6 6L5 3H2" />
        </svg>
        {itemCount > 0 && <span className="lp-floating-cart-count">{itemCount}</span>}
      </motion.button>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
