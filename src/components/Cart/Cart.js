import React, { useContext } from "react";
import { CartContext } from "../../context/CartProvider";

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.map((item, index) => (
        <div key={index}>
          <p>{item.name} - ${item.price.toFixed(2)}</p>
          <button onClick={() => removeFromCart(index)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  );
};

export default Cart;