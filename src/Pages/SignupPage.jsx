import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./SignupPage.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    
    try {
      // For demo: save user data to localStorage
      const userData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        id: 'user-' + Date.now()
      };
      
      // Store in localStorage
      localStorage.setItem('token', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Wait for animation
      await new Promise((r) => setTimeout(r, 1200));
      navigate("/");
    } catch (err) {
      setErrors({ submit: 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  return (
    <div className="auth-page">
      {/* Background Effects */}
      <div className="auth-bg">
        <div className="auth-bg-gradient"></div>
        <div className="auth-bg-orb orb-1"></div>
        <div className="auth-bg-orb orb-2"></div>
      </div>

      {/* Navigation */}
      <nav className="auth-nav">
        <Link to="/" className="auth-logo">MAISON</Link>
        <Link to="/login" className="auth-nav-link">
          Already have an account?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="auth-main">
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join MAISON for exclusive tech drops</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange("name")}
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="auth-error">{errors.name}</span>}
            </div>

            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange("email")}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange("phone")}
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && <span className="auth-error">{errors.phone}</span>}
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange("password")}
                className={errors.password ? "error" : ""}
              />
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" />
                <span>I agree to the Terms & Conditions</span>
              </label>
            </div>

            {errors.submit && <span className="auth-error auth-error--submit">{errors.submit}</span>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span className="auth-spinner"></span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or sign up with</span>
          </div>

          <div className="auth-social">
            <button type="button" className="auth-social-btn google">
              <svg viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button type="button" className="auth-social-btn apple">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
          </div>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
