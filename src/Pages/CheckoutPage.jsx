import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CheckoutPage.css";

const STEPS = ["Delivery", "Payment", "Confirmation"];

export default function CheckoutPage() {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [payMethod, setPayMethod] = useState("card");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", pin: "",
    cardNumber: "", cardName: "", expiry: "", cvv: "",
    upi: "",
  });
  const [errors, setErrors] = useState({});

  const totalINR = total * 83;
  const tax = Math.round(totalINR * 0.05);
  const delivery = totalINR >= 50000 ? 0 : 599;
  const grandTotal = totalINR + tax + delivery;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  const validateDelivery = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!form.phone.match(/^\d{10}$/)) e.phone = "10-digit mobile required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.pin.match(/^\d{6}$/)) e.pin = "6-digit PIN required";
    return e;
  };

  const validatePayment = () => {
    const e = {};
    if (payMethod === "card") {
      if (!form.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) e.cardNumber = "16-digit card number required";
      if (!form.cardName.trim()) e.cardName = "Required";
      if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "MM/YY format";
      if (!form.cvv.match(/^\d{3,4}$/)) e.cvv = "3–4 digit CVV";
    }
    if (payMethod === "upi") {
      if (!form.upi.includes("@")) e.upi = "Valid UPI ID required";
    }
    return e;
  };

  const handleNext = () => {
    if (step === 0) {
      const e = validateDelivery();
      if (Object.keys(e).length) { setErrors(e); return; }
    }
    if (step === 1) {
      const e = validatePayment();
      if (Object.keys(e).length) { setErrors(e); return; }
    }
    setStep((s) => Math.min(s + 1, 2));
    if (step === 1) { clearCart(); }
  };

  const formatCard = (val) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  if (cartItems.length === 0 && step < 2) {
    return (
      <div className="cp-empty">
        <p className="cp-empty-icon">◇</p>
        <p className="cp-empty-title">Your cart is empty.</p>
        <button className="cp-back-btn" onClick={() => navigate("/")}>Return to Collection</button>
      </div>
    );
  }

  return (
    <div className="cp-root">
      {/* Header */}
      <div className="cp-header">
        <button className="cp-logo" onClick={() => navigate("/")}>MAISON</button>
        <div className="cp-steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`cp-step ${i === step ? "cp-step--active" : ""} ${i < step ? "cp-step--done" : ""}`}>
                <span className="cp-step-num">{i < step ? "✓" : i + 1}</span>
                <span className="cp-step-label">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`cp-step-line ${i < step ? "cp-step-line--done" : ""}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="cp-body">
        {/* ── LEFT PANEL ─── */}
        <div className="cp-main">
          <AnimatePresence mode="wait">
            {/* STEP 0: DELIVERY */}
            {step === 0 && (
              <motion.div
                key="delivery"
                className="cp-panel"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="cp-panel-title">Delivery Details</h2>
                <div className="cp-form-grid">
                  <Field label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} full />
                  <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
                  <Field label="Mobile Number" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
                  <Field label="Delivery Address" name="address" value={form.address} onChange={handleChange} error={errors.address} full />
                  <Field label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} />
                  <Field label="PIN Code" name="pin" value={form.pin} onChange={handleChange} error={errors.pin} />
                </div>
                <button className="cp-next-btn" onClick={handleNext}>
                  Continue to Payment →
                </button>
              </motion.div>
            )}

            {/* STEP 1: PAYMENT */}
            {step === 1 && (
              <motion.div
                key="payment"
                className="cp-panel"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="cp-panel-title">Payment Method</h2>
                <div className="cp-pay-methods">
                  {[
                    { id: "card", icon: "◻", label: "Credit / Debit Card" },
                    { id: "upi", icon: "⬡", label: "UPI" },
                    { id: "cod", icon: "◈", label: "Cash on Delivery" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      className={`cp-pay-method ${payMethod === m.id ? "cp-pay-method--active" : ""}`}
                      onClick={() => setPayMethod(m.id)}
                    >
                      <span className="cp-pay-icon">{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {payMethod === "card" && (
                    <motion.div
                      key="card"
                      className="cp-form-grid"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Field
                        label="Card Number"
                        name="cardNumber"
                        value={formatCard(form.cardNumber)}
                        onChange={(e) => setForm((f) => ({ ...f, cardNumber: e.target.value.replace(/\s/g, "") }))}
                        error={errors.cardNumber}
                        placeholder="0000 0000 0000 0000"
                        full
                      />
                      <Field label="Cardholder Name" name="cardName" value={form.cardName} onChange={handleChange} error={errors.cardName} full />
                      <Field
                        label="Expiry"
                        name="expiry"
                        value={form.expiry}
                        onChange={(e) => setForm((f) => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                        error={errors.expiry}
                        placeholder="MM/YY"
                      />
                      <Field label="CVV" name="cvv" value={form.cvv} onChange={handleChange} error={errors.cvv} placeholder="•••" type="password" />
                    </motion.div>
                  )}
                  {payMethod === "upi" && (
                    <motion.div
                      key="upi"
                      className="cp-form-grid"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Field label="UPI ID" name="upi" value={form.upi} onChange={handleChange} error={errors.upi} placeholder="yourname@upi" full />
                    </motion.div>
                  )}
                  {payMethod === "cod" && (
                    <motion.div
                      key="cod"
                      className="cp-cod-note"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p>Cash on Delivery is available for orders under ₹2,00,000. An additional handling charge of ₹299 may apply.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="cp-btn-row">
                  <button className="cp-back-step" onClick={() => setStep(0)}>← Back</button>
                  <button className="cp-next-btn" onClick={handleNext}>Complete Purchase →</button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CONFIRMATION */}
            {step === 2 && (
              <motion.div
                key="confirm"
                className="cp-panel cp-panel--confirm"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="cp-confirm-icon"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  ✦
                </motion.div>
                <h2 className="cp-confirm-title">Order Confirmed</h2>
                <p className="cp-confirm-sub">
                  Your selection will be prepared with the utmost care and dispatched within 2–3 business days.
                  A confirmation has been sent to <strong>{form.email || "your email"}</strong>.
                </p>
                <p className="cp-confirm-order">Order Ref: MN-{Date.now().toString().slice(-8)}</p>
                <button className="cp-next-btn" onClick={() => navigate("/")}>
                  Return to Collection
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT PANEL: ORDER SUMMARY ─── */}
        {step < 2 && (
          <aside className="cp-summary">
            <h3 className="cp-summary-title">Order Summary</h3>
            <div className="cp-summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cp-summary-item">
                  <div className="cp-summary-img-wrap">
                    <img src={item.image} alt={item.name} />
                    <span className="cp-summary-qty">{item.qty}</span>
                  </div>
                  <div className="cp-summary-info">
                    <p className="cp-summary-name">{item.name}</p>
                    <p className="cp-summary-brand">{item.brand}</p>
                  </div>
                  <p className="cp-summary-price">
                    ₹{(item.discountedPrice * 83 * item.qty).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
            <div className="cp-summary-breakdown">
              <div className="cp-breakdown-row">
                <span>Subtotal</span>
                <span>₹{totalINR.toLocaleString("en-IN")}</span>
              </div>
              <div className="cp-breakdown-row">
                <span>GST (5%)</span>
                <span>₹{tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="cp-breakdown-row">
                <span>Delivery</span>
                <span>{delivery === 0 ? <span className="cp-free">Complimentary</span> : `₹${delivery}`}</span>
              </div>
              <div className="cp-breakdown-row cp-breakdown-row--total">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <p className="cp-summary-note">Complimentary gift wrapping included with every order.</p>
          </aside>
        )}
      </div>
    </div>
  );
}

// ── FIELD COMPONENT ──────────────────────────────────────
function Field({ label, name, value, onChange, error, type = "text", placeholder, full }) {
  return (
    <div className={`cp-field ${full ? "cp-field--full" : ""}`}>
      <label className="cp-label">{label}</label>
      <input
        className={`cp-input ${error ? "cp-input--error" : ""}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ""}
        autoComplete="off"
      />
      {error && <span className="cp-error">{error}</span>}
    </div>
  );
}