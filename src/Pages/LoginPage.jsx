import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./LoginPage.css";

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.4 } },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate("/");
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  return (
    <motion.div className="login-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="login-bg">
        <div className="login-bg-line line1" />
        <div className="login-bg-line line2" />
        <div className="login-bg-line line3" />
        <div className="login-bg-orb" />
      </div>

      <motion.div
        className="login-nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <Link to="/" className="login-logo">TECHSTORE</Link>
        <Link to="/signup" className="login-nav-link">
          <span>New member?</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>

      <div className="login-center">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="login-card-ornament">
            <span />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
            <span />
          </div>

          <div className="login-header">
            <p className="login-overline">Welcome Back</p>
            <h1 className="login-title">
              Sign <em>in</em> to<br />your tech world
            </h1>
            <p className="login-subtitle">Access your orders, wishlist, and exclusive deals</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {[
              { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com", idx: 0 },
              { key: "password", label: "Password", type: "password", placeholder: "Enter your password", idx: 1 },
            ].map(({ key, label, type, placeholder }) => (
              <div
                key={key}
                className={`login-field ${errors[key] ? "has-error" : ""} ${focusedField === key ? "is-focused" : ""} ${form[key] ? "has-value" : ""}`}
              >
                <label className="login-label">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={handleChange(key)}
                  onFocus={() => setFocusedField(key)}
                  onBlur={() => setFocusedField(null)}
                  className="login-input"
                />
                <span className="login-field-line" />
                {errors[key] && (
                  <motion.p
                    className="login-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors[key]}
                  </motion.p>
                )}
              </div>
            ))}

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" />
                <span className="checkbox-custom" />
                <span>Remember me</span>
              </label>
              <button type="button" className="login-forgot" onClick={() => alert('Forgot password feature coming soon!')}>Forgot password?</button>
            </div>

            <motion.button
              type="submit"
              className={`login-btn ${loading ? "loading" : ""}`}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <span className="login-loader">
                  <span /><span /><span />
                </span>
              ) : (
                <span className="login-btn-content">
                  <span>Sign In</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </motion.button>

            <div className="login-divider">
              <span>or continue with</span>
            </div>

            <div className="login-social">
              <motion.button
                type="button"
                className="login-social-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert('Google login coming soon!')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </motion.button>
              <motion.button
                type="button"
                className="login-social-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert('Apple login coming soon!')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </motion.button>
            </div>
          </form>

          <p className="login-switch">
            Don't have an account?{" "}
            <Link to="/signup" className="login-switch-link">Create one</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}