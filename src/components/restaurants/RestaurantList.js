// src/components/RestaurantList.js
import React, { useState } from "react"
import { Link } from "gatsby"
// or from "@reach/router" if you're using a client-only approach
import { useRestaurantContext } from "../contexts/RestaurantProvider"

export default function RestaurantList() {
  const { restaurants, loading, error } = useRestaurantContext()
  const [searchQuery, setSearchQuery] = useState("")

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <input
        type="text"
        placeholder="Search restaurants..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul>
        {filtered.map((r) => (
          <li key={r.id}>
            {/* link to /restaurants/ID */}
            <Link to={`/restaurants/${r.id}`}>{r.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}