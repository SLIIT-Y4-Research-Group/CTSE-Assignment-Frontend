import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard", {
        replace: true,
        state: { paymentSuccess: "Payment completed successfully." }
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Payment Successful</h2>
        <p style={styles.text}>Your payment was completed successfully.</p>
        <p style={styles.subtext}>Redirecting to dashboard...</p>
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
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
    textAlign: "center"
  },
  title: {
    marginBottom: "12px"
  },
  text: {
    fontSize: "16px",
    marginBottom: "8px"
  },
  subtext: {
    color: "#666"
  }
};