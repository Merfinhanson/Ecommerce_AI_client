import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../services/api";
import { products as staticProducts } from "../data/products";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import "./LandingPage.css";
import "../components/Ripple.css";

const TICKER_ITEMS = ["New Arrivals", "◆", "Limited Edition Drops", "◆", "Free Delivery Over ₹50,000"];

function Ticker() {
  return (
    <div className="ticker-wrap">
      <motion.div
        className="ticker-track"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="ticker-item">{item}</span>
        ))}
      </motion.div>
    </div>
  );
}

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "smartphones", label: "Smartphones" },
  { id: "laptops", label: "Laptops" },
  { id: "tablets", label: "Tablets" },
  { id: "audio", label: "Audio" },
  { id: "gaming", label: "Gaming" },
  { id: "wearables", label: "Wearables" },
  { id: "cameras", label: "Cameras" },
  { id: "smarthome", label: "Smart Home" },
  { id: "accessories", label: "Accessories" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getProducts({ limit: 100 });
        if (response.data && response.data.products) {
          // Transform backend products to frontend format
          const transformedProducts = response.data.products.map(p => ({
            id: p._id,
            _id: p._id,
            name: p.name,
            brand: p.brand,
            category: p.category,
            tagline: p.tagline,
            description: p.description,
            image: p.image,
            originalPrice: p.originalPrice,
            discountedPrice: p.discountedPrice,
            discount: p.discount,
            badge: p.badge,
            inStock: p.inStock,
            rating: p.rating,
            reviews: p.reviews
          }));
          setProducts(transformedProducts);
        }
      } catch (err) {
        console.error('Failed to fetch products from API, using static data:', err);
        // Fallback to static data when API fails
        setProducts(staticProducts);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Ripple effect handler for buttons
  const createRipple = useCallback((e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple-effect';
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(201, 168, 76, 0.4);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      animation: ripple-animation 0.6s ease-out;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }, []);

  return (
    <div className="lp-root">
      <nav className={`lp-nav ${navScrolled ? "lp-nav--scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <div className="lp-nav-links">
            <button onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} className="lp-nav-link">Products</button>
            <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="lp-nav-link">About</button>
          </div>
          <div className="lp-nav-logo">MAISON</div>
          <div className="lp-nav-actions">
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="lp-nav-link">Contact</button>
            <button className="lp-nav-signin" onClick={() => navigate('/login')}>Sign In</button>
            <button className="lp-nav-cart btn-ripple" onClick={(e) => { createRipple(e); setCartOpen(true); }}>
              Cart ({itemCount})
            </button>
          </div>
        </div>
      </nav>

      <section className="lp-hero" ref={heroRef}>
        <motion.div className="lp-hero-bg" style={{ y: heroY }}>
            <div className="hero-placeholder">Tech Collection 2025</div>
        </motion.div>
        <div className="lp-hero-content">
          <motion.p 
            className="lp-hero-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            NEW ARRIVALS — 2026
          </motion.p>
          <motion.h1 
            className="lp-hero-headline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Future <em>Tech</em> Today
          </motion.h1>
          <motion.p 
            className="lp-hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Premium electronics & gadgets from the world's leading brands.<br />
            Curated for tech enthusiasts who demand excellence.
          </motion.p>
          <motion.div 
            className="lp-hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button className="lp-hero-btn lp-hero-btn--primary btn-ripple" onClick={(e) => { createRipple(e); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore Tech</button>
            <button className="lp-hero-btn lp-hero-btn--secondary btn-ripple" onClick={(e) => { createRipple(e); navigate('/signup'); }}>Join Elite</button>
          </motion.div>
        </div>
        <div className="lp-hero-stats">
          <motion.div 
            className="lp-stat"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="lp-stat-number">50k+</span>
            <span className="lp-stat-label">Tech Enthusiasts</span>
          </motion.div>
          <motion.div 
            className="lp-stat"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="lp-stat-number">500+</span>
            <span className="lp-stat-label">Products</span>
          </motion.div>
          <motion.div 
            className="lp-stat"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="lp-stat-number">25</span>
            <span className="lp-stat-label">Countries</span>
          </motion.div>
        </div>
      </section>

      <Ticker />

      <section className="lp-collection" id="products-section">
        <motion.div 
          className="lp-filters"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {CATEGORIES.map((cat, index) => (
            <motion.button
              key={cat.id}
              className={`lp-filter-btn btn-ripple ${activeCategory === cat.id ? "lp-filter-btn--active" : ""}`}
              onClick={(e) => { createRipple(e); setActiveCategory(cat.id); }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>
        
        {loading && <div className="lp-loading">Loading products...</div>}
        {error && <div className="lp-error">Error: {error}</div>}

        <motion.div 
          className="lp-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filtered.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="lp-about">
        <motion.div 
          className="lp-about-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="lp-about-title">About <em>MAISON</em></h2>
          <p className="lp-about-text">
            Founded in 2024, MAISON curates the finest electronics and tech accessories 
            from around the world. We believe in quality, innovation, and exceptional 
            customer experience. Every product in our collection is handpicked to meet 
            the highest standards of craftsmanship and performance.
          </p>
          <div className="lp-about-stats">
            <div className="lp-about-stat">
              <span className="lp-about-number">50k+</span>
              <span className="lp-about-label">Happy Customers</span>
            </div>
            <div className="lp-about-stat">
              <span className="lp-about-number">500+</span>
              <span className="lp-about-label">Premium Products</span>
            </div>
            <div className="lp-about-stat">
              <span className="lp-about-number">24/7</span>
              <span className="lp-about-label">Customer Support</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="lp-contact">
        <motion.div 
          className="lp-contact-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="lp-contact-title">Get in <em>Touch</em></h2>
          <p className="lp-contact-text">
            Have questions? We're here to help. Reach out to our team for any 
            inquiries about products, orders, or partnerships.
          </p>
          <div className="lp-contact-info">
            <div className="lp-contact-item">
              <span className="lp-contact-label">Email</span>
              <span className="lp-contact-value">support@maison.com</span>
            </div>
            <div className="lp-contact-item">
              <span className="lp-contact-label">Phone</span>
              <span className="lp-contact-value">+91 1800-MAISON-1</span>
            </div>
            <div className="lp-contact-item">
              <span className="lp-contact-label">Address</span>
              <span className="lp-contact-value">Mumbai, India</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-content">
          <div className="lp-footer-logo">MAISON</div>
          <p className="lp-footer-text">© 2024 MAISON. All rights reserved.</p>
        </div>
      </footer>

      {/* Mobile Floating Cart Button */}
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