import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth } from "../../firebase/firebaseConfig";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, "orders"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setOrders(querySnapshot.docs.map((doc) => doc.data()));
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Order History</h2>
      {orders.map((order, index) => (
        <div key={index}>
          <p>Restaurant: {order.restaurantName}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.totalPrice}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;