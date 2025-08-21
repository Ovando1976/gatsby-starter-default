// src/hooks/useOrderStatus.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from "../hooks/useAuth";

/**
 * A hook that manages real-time order status logic.
 * Example fields you might have in Firestore:
 * {
 *   status: "pending" | "preparing" | "en_route" | "delivered" | "canceled",
 *   ...
 * }
 */
export default function useOrderStatus(orderId, { realtime = false } = {}) {
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth(); // if you need user to verify roles or ownership

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided.');
      setLoading(false);
      return;
    }

    // Optionally check if user is logged in
    // if (!user) {
    //   setError('You must be signed in to track order status.');
    //   setLoading(false);
    //   return;
    // }

    // Realtime listening or one-time fetch
    let unsubscribe;
    const orderRef = doc(db, 'orders', orderId);

    async function fetchOrderStatus() {
      try {
        setLoading(true);

        if (realtime) {
          // Live updates with onSnapshot
          unsubscribe = onSnapshot(orderRef, (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              setOrderStatus(data.status);
              setLoading(false);
            } else {
              setError('Order not found.');
              setLoading(false);
            }
          }, (err) => {
            console.error('onSnapshot error:', err);
            setError(err.message);
            setLoading(false);
          });
        } else {
          // One-time fetch with getDoc
          const snap = await getDoc(orderRef);
          if (snap.exists()) {
            const data = snap.data();
            setOrderStatus(data.status);
          } else {
            setError('Order not found.');
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch order status:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchOrderStatus();

    // Cleanup if realtime is used
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [orderId, realtime]);

  /**
   * Example function to update the order's status in Firestore.
   * For instance, marking it as delivered or canceled.
   */
  async function updateOrderStatus(newStatus) {
    try {
      setLoading(true);
      setError('');

      if (!orderId) {
        throw new Error('No order ID provided.');
      }

      // Optional role or ownership checks:
      // if (!user) {
      //   throw new Error('You must be signed in to update this order.');
      // }
      // e.g., if only an admin or driver can update:
      // if (user.role !== 'admin' && user.role !== 'driver') {
      //   throw new Error('Permission denied.');
      // }

      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      
      // If we are in realtime mode, the above onSnapshot
      // will pick up changes automatically.
      // If not in realtime mode, you can manually set:
      if (!realtime) {
        setOrderStatus(newStatus);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  return {
    orderStatus,
    loading,
    error,
    updateOrderStatus,
  };
}