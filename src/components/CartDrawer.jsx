import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CartDrawer.css";

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQty, total, itemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  // Prevent event propagation for buttons to avoid triggering parent events
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cd-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="cd-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            {/* Header */}
            <div className="cd-header">
              <div>
                <h2 className="cd-title">Your Selection</h2>
                <p className="cd-subtitle">{itemCount} {itemCount === 1 ? "piece" : "pieces"}</p>
              </div>
              <button className="cd-close" onClick={onClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="cd-items">
              <AnimatePresence initial={false}>
                {cartItems.length === 0 ? (
                  <motion.div
                    className="cd-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="cd-empty-icon">◇</p>
                    <p className="cd-empty-text">Your curation awaits.</p>
                  </motion.div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="cd-item"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      layout
                    >
                      <img src={item.image} alt={item.name} className="cd-item-img" />
                      <div className="cd-item-info">
                        <p className="cd-item-brand">{item.brand}</p>
                        <p className="cd-item-name">{item.name}</p>
                        <p className="cd-item-price">
                          ₹{item.discountedPrice.toLocaleString("en-IN")}
                        </p>
                        <div className="cd-qty-row">
                          <button 
                            type="button" 
                            className="cd-qty-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQty(item.id, -1);
                            }}
                            disabled={item.qty <= 1}
                          >
                            −
                          </button>
                          <span className="cd-qty">{item.qty}</span>
                          <button 
                            type="button" 
                            className="cd-qty-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQty(item.id, 1);
                            }}
                            disabled={item.qty >= (item.inStock || 10)}
                          >
                            +
                          </button>
                          <button 
                            type="button" 
                            className="cd-remove" 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.id);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="cd-footer">
                <div className="cd-total-row">
                  <span className="cd-total-label">Subtotal</span>
                  <span className="cd-total-val">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <p className="cd-tax-note">Taxes & duties calculated at checkout</p>
                <button 
                  type="button" 
                  className="cd-checkout-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCheckout();
                  }}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}