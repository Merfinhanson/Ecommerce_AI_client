import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authAPI } from "../services/api";
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
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.match(/^[0-9]{10}$/)) e.phone = "Valid 10-digit phone required";
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

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Open Google OAuth popup
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=token&scope=email%20profile`;
      
      // For demo purposes, simulate Google login
      const mockGoogleData = {
        email: "user@gmail.com",
        name: "Google User",
        googleId: "123456789",
        photo: "https://via.placeholder.com/150"
      };
      
      const response = await authAPI.googleLogin(mockGoogleData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/');
      }
    } catch (err) {
      alert('Google login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Apple Sign In
  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      // For demo purposes, simulate Apple login
      const mockAppleData = {
        email: "user@icloud.com",
        name: "Apple User",
        appleId: "987654321"
      };
      
      const response = await authAPI.appleLogin(mockAppleData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/');
      }
    } catch (err) {
      alert('Apple login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
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
                { key: "phone", label: "Phone Number", type: "tel", placeholder: "10-digit number", idx: 1 },
                { key: "email", label: "Email Address", type: "email", placeholder: "your@email.com", idx: 2 },
                { key: "password", label: "Password", type: "password", placeholder: "Min. 6 characters", idx: 3 },
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

              <motion.div 
                className="auth-divider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.8 } }}
              >
                <span>or continue with</span>
              </motion.div>

              <motion.div 
                className="auth-social"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.85 } }}
              >
                <button type="button" className="auth-social-btn google" onClick={handleGoogleSignIn} disabled={loading}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button type="button" className="auth-social-btn apple" onClick={handleAppleSignIn} disabled={loading}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Apple
                </button>
              </motion.div>
            </form>

            <motion.p
              className="auth-switch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.95 } }}
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