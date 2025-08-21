import React from "react";

const OrderItem = ({ order }) => {
  if (!order) return null;

  return (
    <div style={styles.container}>
      <h3>{order.productName}</h3>
      <p>Quantity: {order.quantity}</p>
      <p>Total Price: ${(order.price * order.quantity).toFixed(2)}</p>
      <p>Status: <strong style={{ color: getStatusColor(order.status) }}>{order.status}</strong></p>
    </div>
  );
};

// Helper function to color code order status
const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "orange";
    case "Completed":
      return "green";
    case "Cancelled":
      return "red";
    default:
      return "black";
  }
};

// Basic CSS-in-JS styles
const styles = {
  container: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "10px",
    background: "#f9f9f9",
  },
};

export default OrderItem;