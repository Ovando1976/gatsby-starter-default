import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore";
import styles from "./styles/foodDelivery.module.css";

const FoodDelivery = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderStatus, setOrderStatus] = useState("Preparing");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "menu"));
        const fetchedMenu = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenu(fetchedMenu);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const placeOrder = () => {
    if (!orderDetails.name || !orderDetails.address || !orderDetails.phone) {
      alert("Please fill in all delivery details.");
      return;
    }
    setIsOrderPlaced(true);

    // Simulate order tracking updates
    setTimeout(() => setOrderStatus("Out for Delivery"), 5000);
    setTimeout(() => setOrderStatus("Delivered"), 10000);
  };

  return (
    <div className={styles.container}>
      <h1>Food Delivery Module</h1>

      {/* Menu */}
      <div className={styles.menu}>
        <h2>Menu</h2>
        {menu.map((item) => (
          <div key={item.id} className={styles.menuItem}>
            <span>{item.name}</span>
            <span>${item.price.toFixed(2)}</span>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className={styles.cart}>
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price.toFixed(2)}
                <button onClick={() => removeFromCart(index)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Order Form */}
      {!isOrderPlaced && (
        <div className={styles.orderForm}>
          <h2>Delivery Details</h2>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setOrderDetails({ ...orderDetails, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
          />
          <button onClick={placeOrder}>Place Order</button>
        </div>
      )}

      {/* Order Status */}
      {isOrderPlaced && (
        <div className={styles.orderStatus}>
          <h2>Order Status</h2>
          <p>{orderStatus}</p>
        </div>
      )}
    </div>
  );
};

export default FoodDelivery;