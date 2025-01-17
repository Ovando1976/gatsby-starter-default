import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useCart } from "../contexts/CartProvider";
import styles from "./styles/foodDelivery.module.css";
import Navbar from "../src/components/Shared/NavBar";

const FoodDelivery = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const { cart, addToCart, removeFromCart } = useCart();
  const [orderDetails, setOrderDetails] = useState({});
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderStatus, setOrderStatus] = useState("Preparing");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch restaurant data from Firestore
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const restaurantsCollection = collection(db, "restaurants");
        const querySnapshot = await getDocs(restaurantsCollection);
        const fetchedRestaurants = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            menu: Array.isArray(data.menu) ? data.menu : Object.entries(data.menu || {}).flat(),
          };
        });
        setRestaurants(fetchedRestaurants);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const selectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const placeOrder = () => {
    if (!orderDetails.name || !orderDetails.address || !orderDetails.phone) {
      alert("Please fill in all delivery details.");
      return;
    }
    setIsOrderPlaced(true);

    // Simulate order updates
    setTimeout(() => setOrderStatus("Out for Delivery"), 5000);
    setTimeout(() => setOrderStatus("Delivered"), 10000);
  };

  if (isLoading) return <p>Loading restaurants...</p>;
  if (error) return <p>Error fetching restaurants: {error}</p>;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1>Food Delivery Module</h1>

        {/* Restaurant Selection */}
        <div className={styles.restaurants}>
          <h2>Select a Restaurant</h2>
          {restaurants.length === 0 ? (
            <p>No restaurants found.</p>
          ) : (
            restaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                className={`${styles.restaurantButton} ${
                  selectedRestaurant?.id === restaurant.id ? styles.selected : ""
                }`}
                onClick={() => selectRestaurant(restaurant)}
                aria-label={`Select ${restaurant.name}`}
              >
                {restaurant.name}
              </button>
            ))
          )}
        </div>

        {/* Restaurant Menu */}
        {selectedRestaurant && (
          <div className={styles.menu}>
            <h2>Menu - {selectedRestaurant.name}</h2>
            {selectedRestaurant.menu && selectedRestaurant.menu.length > 0 ? (
              selectedRestaurant.menu.map((item) => (
                <div key={item.name} className={styles.menuItem}>
                  <span>{item.name}</span>
                  <span>${item.price?.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className={styles.addToCartButton}
                    aria-label={`Add ${item.name} to cart`}
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>Menu not available for this restaurant.</p>
            )}
          </div>
        )}

        {/* Cart */}
        <div className={styles.cart}>
          <h2>Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cart.map((item, index) => (
                <li key={index} className={styles.cartItem}>
                  {item.name} - ${item.price?.toFixed(2)}
                  <button
                    onClick={() => removeFromCart(index)}
                    className={styles.removeFromCartButton}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Order Form */}
        {!isOrderPlaced && cart.length > 0 && (
          <div className={styles.orderForm}>
            <h2>Delivery Details</h2>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setOrderDetails({ ...orderDetails, name: e.target.value })}
              className={styles.inputField}
            />
            <input
              type="text"
              placeholder="Address"
              onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
              className={styles.inputField}
            />
            <input
              type="text"
              placeholder="Phone Number"
              onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
              className={styles.inputField}
            />
            <button
              onClick={placeOrder}
              className={styles.placeOrderButton}
              aria-label="Place order"
            >
              Place Order
            </button>
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
    </>
  );
};

export default FoodDelivery;