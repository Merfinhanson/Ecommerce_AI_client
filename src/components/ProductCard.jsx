import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarRating from "./StarRating";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";
import "./Ripple.css";

export default function ProductCard({ product }) {
  const { addToCart, lastAdded } = useCart();
  const [showReviews, setShowReviews] = useState(false);
  const [ripples, setRipples] = useState([]);
  const isJustAdded = lastAdded === product.id;

  // Card ripple effect
  const handleCardClick = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);
  }, []);

  // Button ripple effect
  const createButtonRipple = useCallback((e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
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

  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="pc-perspective">
      <motion.div
        className={`pc-card-wrapper ${isFlipped ? 'flipped' : ''}`}
        layout
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6 }}
        style={{ '--ripple-x': '50%', '--ripple-y': '50%' }}
      >
        <div className="pc-card-inner">
          {/* Front Face */}
          <div className="pc-card-front pc-card card-ripple shine-effect"
               onClick={(e) => {
                 handleCardClick(e);
                 setIsFlipped(!isFlipped);
               }}
          >
            {/* Ripple effects */}
            <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="card-ripple-effect"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: 100,
              height: 100,
              marginLeft: -50,
              marginTop: -50,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201, 168, 76, 0.3) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        ))}
      </AnimatePresence>
      {/* Badge */}
      {product.badge && (
        <span className={`pc-badge pc-badge--${product.badge.toLowerCase().replace(/\s+/g, "-")}`}>
          {product.badge}
        </span>
      )}

      {/* Image */}
      <div className="pc-img-wrap">
        <img src={product.image} alt={product.name} className="pc-img" loading="lazy" />
        <div className="pc-img-overlay">
          <button
            className="pc-quick-view"
            onClick={() => setShowReviews((v) => !v)}
          >
            {showReviews ? "Hide Reviews" : "Read Reviews"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="pc-body">
        <p className="pc-brand">{product.brand}</p>
        <h3 className="pc-name">{product.name}</h3>
        <p className="pc-tagline">{product.tagline}</p>
        <p className="pc-desc">{product.description}</p>

        {/* Rating */}
        <div className="pc-rating-row">
          <StarRating rating={product.rating} />
          <span className="pc-rating-val">{product.rating}</span>
        </div>

        {/* Price */}
        <div className="pc-price-row">
          <span className="pc-price-original">
            ₹{(product.originalPrice * 83).toLocaleString("en-IN")}
          </span>
          <span className="pc-price-discounted">
            ₹{(product.discountedPrice * 83).toLocaleString("en-IN")}
          </span>
          <span className="pc-discount-badge">−{product.discount}%</span>
        </div>

        {/* CTA */}
        <motion.button
          className={`pc-add-btn btn-ripple ${isJustAdded ? "pc-add-btn--added" : ""}`}
          onClick={(e) => {
            createButtonRipple(e);
            addToCart(product);
          }}
          whileTap={{ scale: 0.96 }}
        >
          <AnimatePresence mode="wait">
            {isJustAdded ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                ✓ Added
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Reviews panel */}
      <AnimatePresence>
        {showReviews && (
          <motion.div
            className="pc-reviews"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {product.reviews.map((r, i) => (
              <div key={i} className="pc-review-item">
                <div className="pc-review-header">
                  <StarRating rating={r.stars} size={11} />
                  <span className="pc-review-author">{r.author}</span>
                </div>
                <p className="pc-review-text">"{r.text}"</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
          </div>
        
        {/* Back Face */}
        <div className="pc-card-back">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{product.name}</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '16px', opacity: 0.9 }}>{product.description}</p>
          <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
            ₹{(product.discountedPrice * 83).toLocaleString('en-IN')}
          </div>
          <button 
            className="pc-add-btn"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            style={{ background: 'white', color: '#6366f1', marginTop: '20px' }}
          >
            Add to Cart
          </button>
          <p style={{ marginTop: '16px', fontSize: '0.8rem', opacity: 0.7 }}>Click to flip back</p>
        </div>
      </div>
    </div>
  );
}