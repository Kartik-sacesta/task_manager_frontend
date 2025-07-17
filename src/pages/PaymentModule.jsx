import React, { useState } from "react";
import axios from "axios";

const PaymentModule = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const initiatePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    setPaymentStatus("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/payment/create",
        {
          amount: parseFloat(amount),
        }
      );

      if (!data.success) {
        alert("Error creating order. Please try again.");
        setLoading(false);
        return;
      }

      const { order } = data;

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "My Learning App",
        description: "Test Payment for Learning",
        order_id: order.id,
        handler: async function (response) {
          setLoading(true);
          try {
            const { data: verificationData } = await axios.post(
              "http://localhost:5000/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verificationData.success) {
              setPaymentStatus("Payment successful and verified!");
            } else {
              setPaymentStatus("Payment successful, but verification failed.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setPaymentStatus(
              "Payment successful, but an error occurred during verification."
            );
          } finally {
            setLoading(false);
          }
        },
        theme: {
          color: "#3399CC",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

      rzp1.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
        setPaymentStatus("Payment failed.");
        setLoading(false);
      });
    } catch (error) {
      console.error("Error during payment initiation:", error);
      setPaymentStatus("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "400px",
        margin: "50px auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Razorpay Test Payment</h2>
      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="amount"
          style={{ display: "block", marginBottom: "5px" }}
        >
          Enter Amount (INR):
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={handleAmountChange}
          placeholder="e.g., 100"
          style={{
            width: "100%",
            padding: "8px",
            boxSizing: "border-box",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
      </div>
      <button
        onClick={initiatePayment}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px 15px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {loading ? "Processing..." : "Pay with Razorpay"}
      </button>
      {paymentStatus && (
        <p
          style={{
            marginTop: "15px",
            fontWeight: "bold",
            color: paymentStatus.includes("successful") ? "green" : "red",
          }}
        >
          {paymentStatus}
        </p>
      )}
    </div>
  );
};

export default PaymentModule;
