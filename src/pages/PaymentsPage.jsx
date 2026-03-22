import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createPaymentCheckoutSession } from "../api/apiService.js";

export default function PaymentPage() {
  const location = useLocation();

  const [formData, setFormData] = useState({
    user_id: "",
    event_id: "",
    ticket_id: "",
    quantity: 1,
    total_amount: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const payment = query.get("payment");

    if (payment === "cancelled") {
      setInfoMessage("Payment cancelled. Please try again.");
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "total_amount"
          ? Number(value)
          : value
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      const response = await createPaymentCheckoutSession(formData);
      const data = response.data;

      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      throw new Error("Checkout URL not returned from server");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Event Ticket Payment</h2>
        <p style={styles.subtitle}>Enter booking details and continue to payment</p>

        <form onSubmit={handleCheckout} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>User ID</label>
            <input
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              placeholder="u001"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Event ID</label>
            <input
              type="text"
              name="event_id"
              value={formData.event_id}
              onChange={handleChange}
              placeholder="e001"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Ticket ID</label>
            <input
              type="text"
              name="ticket_id"
              value={formData.ticket_id}
              onChange={handleChange}
              placeholder="t001"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Total Amount</label>
            <input
              type="number"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
              placeholder="2500"
              min="1"
              required
              style={styles.input}
            />
          </div>

          {infoMessage && <div style={styles.info}>{infoMessage}</div>}
          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Processing..." : "Checkout"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.08)"
  },
  title: {
    margin: 0,
    marginBottom: "8px"
  },
  subtitle: {
    marginTop: 0,
    marginBottom: "24px",
    color: "#666"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    marginBottom: "6px",
    fontWeight: "600"
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px"
  },
  button: {
    marginTop: "8px",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer"
  },
  error: {
    color: "#b00020",
    background: "#fdecea",
    padding: "10px",
    borderRadius: "8px"
  },
  info: {
    color: "#0c5460",
    background: "#d1ecf1",
    padding: "10px",
    borderRadius: "8px"
  }
};