import React from "react";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  if (!item) return null;

  return (
    <div style={styles.container}>
      <h3>{item.productName}</h3>
      <p>Price: ${(item.price).toFixed(2)}</p>
      <div style={styles.controls}>
        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
          -
        </button>
        <span style={styles.quantity}>{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>
      <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
      <button style={styles.removeButton} onClick={() => onRemove(item.id)}>
        Remove
      </button>
    </div>
  );
};

// Basic CSS-in-JS styles
const styles = {
  container: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "10px",
    background: "#f9f9f9",
    textAlign: "center",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  quantity: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "red",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default CartItem;