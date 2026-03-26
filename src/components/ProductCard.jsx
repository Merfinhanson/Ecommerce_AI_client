import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarRating from "./StarRating";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart, lastAdded } = useCart();
  const [showReviews, setShowReviews] = useState(false);
  const isJustAdded = lastAdded === product.id;

  return (
    <motion.div
      className="pc-card"
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
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
          className={`pc-add-btn ${isJustAdded ? "pc-add-btn--added" : ""}`}
          onClick={() => addToCart(product)}
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
    </motion.div>
  );
}