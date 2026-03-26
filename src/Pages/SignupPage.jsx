import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./SignupPage.css";

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

const fieldVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate("/login");
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  return (
    <motion.div className="auth-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="auth-bg">
        <div className="auth-bg-orb orb1" />
        <div className="auth-bg-orb orb2" />
        <div className="auth-grain" />
      </div>

      <div className="auth-split">
        <motion.div
          className="auth-brand-panel"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          <Link to="/" className="auth-logo">MAISON</Link>
          <div className="auth-brand-tagline">
            <p className="tagline-overline">Est. 2024</p>
            <h2 className="tagline-heading">Curated for<br /><em>the discerning</em></h2>
            <p className="tagline-sub">Join a world where craftsmanship<br />meets contemporary elegance.</p>
          </div>
          <div className="auth-brand-dots">
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </motion.div>

        <div className="auth-form-panel">
          <motion.div
            className="auth-form-wrapper"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="auth-form-header">
              <p className="form-overline">Create Account</p>
              <h1 className="form-title">Begin your<br /><em>journey</em></h1>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {[
                { key: "name", label: "Full Name", type: "text", placeholder: "Your name", idx: 0 },
                { key: "email", label: "Email Address", type: "email", placeholder: "your@email.com", idx: 1 },
                { key: "password", label: "Password", type: "password", placeholder: "Min. 6 characters", idx: 2 },
              ].map(({ key, label, type, placeholder, idx }) => (
                <motion.div
                  key={key}
                  className={`form-field ${errors[key] ? "has-error" : ""} ${focusedField === key ? "is-focused" : ""} ${form[key] ? "has-value" : ""}`}
                  variants={fieldVariants}
                  custom={idx}
                  initial="initial"
                  animate="animate"
                >
                  <label className="field-label">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={handleChange(key)}
                    onFocus={() => setFocusedField(key)}
                    onBlur={() => setFocusedField(null)}
                    className="field-input"
                  />
                  <span className="field-line" />
                  {errors[key] && (
                    <motion.p
                      className="field-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors[key]}
                    </motion.p>
                  )}
                </motion.div>
              ))}

              <motion.button
                type="submit"
                className={`auth-btn ${loading ? "loading" : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.7 } }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loader">
                    <span /><span /><span />
                  </span>
                ) : (
                  <span className="btn-content">
                    <span>Create Account</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </motion.button>
            </form>

            <motion.p
              className="auth-switch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.9 } }}
            >
              Already a member?{" "}
              <Link to="/login" className="auth-switch-link">Sign in</Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}