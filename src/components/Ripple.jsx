import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Ripple.css";

export function useRipple() {
  const [ripples, setRipples] = useState([]);

  const createRipple = useCallback((event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  }, []);

  const RippleContainer = ({ children, className = "" }) => (
    <>
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className={`ripple-effect ${className}`}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
      </AnimatePresence>
    </>
  );

  return { createRipple, RippleContainer };
}

export default function Ripple({ children, onClick, className = "" }) {
  const { createRipple, RippleContainer } = useRipple();

  const handleClick = (e) => {
    createRipple(e);
    if (onClick) onClick(e);
  };

  return (
    <span className={`ripple-wrapper ${className}`} onClick={handleClick}>
      <RippleContainer />
      {children}
    </span>
  );
}
