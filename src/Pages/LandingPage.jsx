import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { products as staticProducts } from "../data/products";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import "./LandingPage.css";

// Filter products for homepage - only featured/new arrivals
const FEATURED_PRODUCTS = staticProducts.filter(p => 
  p.badge === "Best Seller" || p.badge === "New Arrival" || p.badge === "Hot"
).slice(0, 6);

const NEW_ARRIVALS = staticProducts.filter(p => 
  p.badge === "New Arrival" || p.badge === "New"
).slice(0, 4);

export default function LandingPage() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="lp-root">
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            className="lp-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <button onClick={() => scrollToSection('featured')}>Featured</button>
            <button onClick={() => scrollToSection('new-arrivals')}>New Arrivals</button>
            <button onClick={() => navigate('/products')}>All Products</button>
            <button onClick={() => scrollToSection('about')}>About</button>
            <button onClick={() => scrollToSection('contact')}>Contact</button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="lp-hero" ref={heroRef}>
        <motion.div className="lp-hero-bg" style={{ y: heroY }}>
          <div className="hero-gradient"></div>
        </motion.div>
        
        <div className="lp-hero-content">
          <motion.p 
            className="lp-hero-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            NEXT GEN TECHNOLOGY
          </motion.p>
          
          <motion.h1 
            className="lp-hero-headline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Future Tech<br />
            <span className="gradient-text">Today</span>
          </motion.h1>
          
          <motion.p 
            className="lp-hero-sub"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Premium smartphones, laptops, audio & gaming gear.<br />
            Curated for tech enthusiasts.
          </motion.p>

          <motion.div 
            className="lp-hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button className="lp-hero-btn lp-hero-btn--primary" onClick={() => scrollToSection('featured')}>
              Shop Now
            </button>
            <button className="lp-hero-btn lp-hero-btn--secondary" onClick={() => navigate('/products')}>
              View All
            </button>
          </motion.div>

          <motion.div 
            className="lp-hero-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="lp-stat">
              <span className="lp-stat-number">50k+</span>
              <span className="lp-stat-label">Customers</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-number">500+</span>
              <span className="lp-stat-label">Products</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-number">4.9</span>
              <span className="lp-stat-label">Rating</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="lp-section lp-section--dark">
        <div className="lp-section-header">
          <h2 className="lp-section-title">Featured <span>Products</span></h2>
          <p className="lp-section-subtitle">Top selling items this week</p>
        </div>

        <div className="lp-products-grid">
          {FEATURED_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="lp-section-cta">
          <button className="lp-btn-outline" onClick={() => navigate('/products')}>
            View All Products →
          </button>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section id="new-arrivals" className="lp-section lp-section--gradient">
        <div className="lp-section-header">
          <h2 className="lp-section-title">New <span>Arrivals</span></h2>
          <p className="lp-section-subtitle">Latest tech just landed</p>
        </div>

        <div className="lp-products-grid lp-products-grid--small">
          {NEW_ARRIVALS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="lp-section lp-section--dark">
        <div className="lp-section-header">
          <h2 className="lp-section-title">Shop by <span>Category</span></h2>
        </div>

        <div className="lp-categories-grid">
          {[
            { name: 'Smartphones', icon: '📱', color: '#3b82f6' },
            { name: 'Laptops', icon: '💻', color: '#8b5cf6' },
            { name: 'Audio', icon: '🎧', color: '#ec4899' },
            { name: 'Gaming', icon: '🎮', color: '#10b981' },
            { name: 'Wearables', icon: '⌚', color: '#f59e0b' },
            { name: 'Accessories', icon: '🔌', color: '#6b7280' },
          ].map((cat, index) => (
            <motion.button
              key={cat.name}
              className="lp-category-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => navigate('/products')}
              style={{ '--category-color': cat.color }}
            >
              <span className="lp-category-icon">{cat.icon}</span>
              <span className="lp-category-name">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="lp-section lp-section--about">
        <motion.div 
          className="lp-about-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="lp-section-title">Why Choose <span>MAISON</span></h2>
          <div className="lp-features-grid">
            <div className="lp-feature">
              <div className="lp-feature-icon">⚡</div>
              <h3>Fast Delivery</h3>
              <p>Free shipping on orders over ₹50,000</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">🛡️</div>
              <h3>2 Year Warranty</h3>
              <p>Extended warranty on all products</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">🔄</div>
              <h3>Easy Returns</h3>
              <p>30-day hassle-free return policy</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">💬</div>
              <h3>24/7 Support</h3>
              <p>Round the clock customer service</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="lp-section lp-section--contact">
        <div className="lp-contact-content">
          <h2 className="lp-section-title">Get in <span>Touch</span></h2>
          <p className="lp-contact-text">
            Have questions? We're here to help 24/7
          </p>
          <div className="lp-contact-info">
            <a href="mailto:support@maison.com" className="lp-contact-item">
              <span className="lp-contact-label">Email</span>
              <span className="lp-contact-value">support@maison.com</span>
            </a>
            <a href="tel:+911800123456" className="lp-contact-item">
              <span className="lp-contact-label">Phone</span>
              <span className="lp-contact-value">+91 1800-123-456</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-content">
          <div className="lp-footer-logo">MAISON</div>
          <div className="lp-footer-links">
            <button onClick={() => navigate('/products')}>Products</button>
            <button onClick={() => scrollToSection('about')}>About</button>
            <button onClick={() => scrollToSection('contact')}>Contact</button>
          </div>
          <p className="lp-footer-text">© 2024 MAISON. All rights reserved.</p>
        </div>
      </footer>

      {/* Mobile Floating Cart */}
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
