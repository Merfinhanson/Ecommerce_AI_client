import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// Ensure these paths match your folder structure exactly
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import "./LandingPage.css";

// ── MARQUEE TICKER ───────────────────────────────────────
const TICKER_ITEMS = [
  "New Arrivals", "◆", "Limited Edition Drops", "◆", 
  "Complimentary Gift Wrapping", "◆", "Free Delivery Over ₹50,000", "◆",
  "Exclusive Member Access", "◆",
];

function Ticker() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker-wrap">
      <motion.div
        className="ticker-track"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="ticker-item">{item}</span>
        ))}
      </motion.div>
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────
export default function LandingPage() {
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="lp-root">
      {/* ── NAVBAR ─────────────────────────────────────── */}
      <nav className={`lp-nav ${navScrolled ? "lp-nav--scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <ul className="lp-nav-links">
            <li><a href="#collection">Collection</a></li>
            <li><a href="#hero">Maison</a></li>
          </ul>

          <a href="#hero" className="lp-nav-logo">MAISON</a>

          <ul className="lp-nav-links lp-nav-links--right">
            <li><a href="#collection">New Arrivals</a></li>
            <li><a href="#footer">Contact</a></li>
          </ul>

          <button className="lp-nav-cart" onClick={() => setCartOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {itemCount > 0 && <span className="lp-cart-count">{itemCount}</span>}
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────── */}
      <section className="lp-hero" id="hero" ref={heroRef}>
        <motion.div className="lp-hero-bg" style={{ y: heroY }}>
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=80"
            alt="Luxury hero"
            className="lp-hero-bg-img"
          />
          <div className="lp-hero-bg-overlay" />
        </motion.div>

        <motion.div className="lp-hero-content" style={{ opacity: heroOpacity }}>
          <p className="lp-hero-eyebrow">New Collection — 2025</p>
          <h1 className="lp-hero-headline">Objects of<br />Singular Desire</h1>
          <p className="lp-hero-sub">Curated luxury for those who understand the difference.</p>
          <motion.button
            className="lp-hero-cta"
            onClick={() => document.getElementById("collection").scrollIntoView({ behavior: "smooth" })}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Explore Collection
          </motion.button>
        </motion.div>
      </section>

      {/* ── TICKER ─────────────────────────────────────── */}
      <Ticker />

      {/* ── COLLECTION ─────────────────────────────────── */}
      <section className="lp-collection" id="collection">
        <div className="lp-collection-header">
          <p className="lp-section-eyebrow">The Edit</p>
          <h2 className="lp-section-title">Curated Luxury</h2>
        </div>

        {/* Category Filter */}
        <div className="lp-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`lp-filter-btn ${activeCategory === cat.id ? "lp-filter-btn--active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div className="lp-grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="lp-footer" id="footer">
        <div className="lp-footer-top">
          <div className="lp-footer-brand">
            <h3 className="lp-footer-logo">MAISON</h3>
            <p className="lp-footer-tagline">Objects of singular desire.</p>
          </div>
          <div className="lp-footer-col">
            <h4 className="lp-footer-col-title">Services</h4>
            <ul>
              <li>White-Glove Delivery</li>
              <li>Bespoke Orders</li>
              <li>Authentication</li>
            </ul>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <p>© 2025 MAISON. All rights reserved.</p>
        </div>
      </footer>

      {/* ── CART DRAWER ────────────────────────────────── */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}