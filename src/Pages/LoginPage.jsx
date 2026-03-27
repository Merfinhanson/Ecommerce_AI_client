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
        <Link to="/" className="login-logo">MAISON</Link>
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
              Sign <em>in</em> to<br />your world
            </h1>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {[
              { key: "email", label: "Email Address", type: "email", placeholder: "your@email.com", idx: 0 },
              { key: "password", label: "Password", type: "password", placeholder: "Your password", idx: 1 },
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
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              disabled={loading}
            >
              {loading ? (
                <span className="login-loader">
                  <span /><span /><span />
                </span>
              ) : (
                <span className="login-btn-content">
                  <span>Enter</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </motion.button>
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