import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import "./LandingPage.css";

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

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="lp-root">
      <nav className={`lp-nav ${navScrolled ? "lp-nav--scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <div className="lp-nav-logo">MAISON</div>
          <button className="lp-nav-cart" onClick={() => setCartOpen(true)}>
            CART ({itemCount})
          </button>
        </div>
      </nav>

      <section className="lp-hero" ref={heroRef}>
        <motion.div className="lp-hero-bg" style={{ y: heroY }}>
            <div className="hero-placeholder">Luxury Collection 2025</div>
        </motion.div>
        <h1>Objects of Singular Desire</h1>
      </section>

      <Ticker />

      <section className="lp-collection" id="collection">
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

        <div className="lp-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}