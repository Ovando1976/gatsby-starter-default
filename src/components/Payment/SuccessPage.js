import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";

const SuccessPage = () => {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/retrieve-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setSessionData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch session details.");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError("No session ID found.");
    }
  }, [sessionId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main style={{ textAlign: "center", padding: "50px" }}>
      <h1>🎉 Payment Successful!</h1>
      <p>Thank you for your purchase, {sessionData?.customer_details?.name}!</p>
      <p>Transaction ID: {sessionData?.id}</p>
      <p>Amount Paid: ${(sessionData?.amount_total / 100).toFixed(2)} {sessionData?.currency.toUpperCase()}</p>
      <Link to="/" style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}>
        ← Back to Home
      </Link>
    </main>
  );
};

export default SuccessPage;