import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseStorage } from "firebaseConfig";

const auth = getFirebaseAuth();
const db = getFirebaseFirestore();
const storage = getFirebaseStorage();

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get the currently logged-in user's ID
        const userId = auth.currentUser?.uid; // Ensure user is logged in

        if (!userId) {
          throw new Error("User is not logged in.");
        }

        // Query Firestore for orders belonging to the current user
        const q = query(collection(db, "orders"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        // Map the fetched data to an array of orders
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading order history...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <h2>{order.restaurantName}</h2>
              <p>Status: {order.status}</p>
              <p>Total: ${order.totalPrice?.toFixed(2)}</p>
              <ul>
                {order.items?.map((item, index) => (
                  <li key={index}>
                    {item.name} - ${item.price?.toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;