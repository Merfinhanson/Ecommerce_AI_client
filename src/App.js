import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "./context/CartContext";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import CheckoutPage from "./Pages/CheckoutPage";
import ProductsPage from "./Pages/ProductsPage";
import "./App.css";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </CartProvider>
  );
}
export default App;
