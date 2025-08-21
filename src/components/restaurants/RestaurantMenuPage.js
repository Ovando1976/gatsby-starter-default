// src/components/RestaurantMenuPage.js
import React from "react"
import { useParams } from "@reach/router"
import RestaurantMenu from "./RestaurantMenu"

export default function RestaurantMenuPage() {
  const { id } = useParams()
  return <RestaurantMenu restaurantId={id} />
}