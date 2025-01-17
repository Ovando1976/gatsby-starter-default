import React from "react";
import { useRouter } from "next/router";
import RestaurantMenu from "../../src/components/Restaurant/RestaurantMenu";

const RestaurantMenuPage = () => {
  const router = useRouter();
  const { id } = router.query; // Dynamic route parameter

  return <RestaurantMenu restaurantId={id} />;
};

export default RestaurantMenuPage;