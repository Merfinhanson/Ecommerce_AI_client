import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { productAPI } from "../services/api";
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
        setError(err.message);
        console.error('Failed to fetch products:', err);
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
            <a href="#collection" className="lp-nav-link">Collection</a>
            <a href="#about" className="lp-nav-link">About</a>
          </div>
          <div className="lp-nav-logo">MAISON</div>
          <div className="lp-nav-actions">
            <a href="#contact" className="lp-nav-link">Contact</a>
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
            <button className="lp-hero-btn lp-hero-btn--primary btn-ripple" onClick={createRipple}>Explore Tech</button>
            <button className="lp-hero-btn lp-hero-btn--secondary btn-ripple" onClick={createRipple}>Join Elite</button>
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

      <section className="lp-collection" id="collection">
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

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}