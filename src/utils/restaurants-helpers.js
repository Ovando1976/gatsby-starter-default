// src/utils/restaurants-helpers.js

/**
 * fetchRestaurants
 * Return a sample list of restaurants on St. Thomas, USVI.
 * NOTE: This is not an exhaustive list; feel free to add, remove, or customize.
 */
export const fetchRestaurants = () => {
    return [
      {
        id: "1",
        name: "Gladys' Café",
        cuisine: "Caribbean / Local",
        location: "Royal Dane Mall, Charlotte Amalie",
        description: "Famous for conch fritters, homemade hot sauce, and friendly atmosphere."
      },
      {
        id: "2",
        name: "Mafolie Restaurant",
        cuisine: "American / Caribbean",
        location: "Mafolie Hotel, Charlotte Amalie",
        description: "Offers sweeping views of the harbor; prime rib and seafood are popular."
      },
      {
        id: "3",
        name: "Old Stone Farmhouse",
        cuisine: "Upscale American",
        location: "Estate St. Peter Mountain",
        description: "Historic setting known for farm-to-table cuisine and romantic ambiance."
      },
      {
        id: "4",
        name: "E's Garden Teahouse",
        cuisine: "Tea & Light Bites",
        location: "Garden St, Charlotte Amalie",
        description: "Cozy spot for tea, pastries, and local treats with a tranquil garden vibe."
      },
      {
        id: "5",
        name: "The Smoking Rooster",
        cuisine: "Barbecue",
        location: "Frenchtown, Charlotte Amalie",
        description: "Casual BBQ joint serving smoked brisket, ribs, and island-inspired sides."
      },
      {
        id: "6",
        name: "Twisted Cork Café",
        cuisine: "American / Seafood",
        location: "Frenchtown, Charlotte Amalie",
        description: "Locally sourced seafood, creative small plates, and an extensive wine list."
      },
      {
        id: "7",
        name: "Side Street Pub",
        cuisine: "Caribbean Pub Food",
        location: "Charlotte Amalie alleyway",
        description: "Friendly hangout for rum cocktails and hearty bar fare with an island twist."
      },
      {
        id: "8",
        name: "Room With A View",
        cuisine: "Mediterranean / Seafood",
        location: "Bluebeard's Castle, Charlotte Amalie",
        description: "Elevated dining with ocean views; known for steaks, seafood, and wine."
      },
      {
        id: "9",
        name: "Pesce",
        cuisine: "Italian / Seafood",
        location: "Red Hook, East End",
        description: "Fresh pasta, seafood specials, and a lively bar scene in the East End."
      },
      {
        id: "10",
        name: "Cuzzin's Caribbean Restaurant & Bar",
        cuisine: "Caribbean",
        location: "Back Street, Charlotte Amalie",
        description: "Classic local dishes—stewed oxtail, curry goat, plantains—in a cozy spot."
      }
    ];
  };