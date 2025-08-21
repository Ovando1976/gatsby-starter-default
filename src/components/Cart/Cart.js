import React, { useContext } from "react";
import CartItem from "../components/CartItem";
import { CartContext } from "../../../context/CartProvider";

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([
    { id: "1", productName: "Laptop", price: 999.99, quantity: 1 },
    { id: "2", productName: "Headphones", price: 49.99, quantity: 2 },
    { id: "3", productName: "Smartphone", price: 699.99, quantity: 1 },
  ]);

  // Update quantity of a cart item
  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

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