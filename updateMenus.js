const { db } = require('./firebaseAdmin'); // Adjust the path to your Firebase Admin SDK setup

async function updateMenus() {
  const restaurantsRef = db.collection('restaurants');

  const updates = [
    {
      name: "Caribbean Fish Market",
      menu: [
        { name: "Stuffed Lobster Tail", price: 45.0 },
        { name: "Chilean Sea Bass", price: 42.0 },
      ],
    },
    {
      name: "The Smoking Rooster",
      menu: [
        { name: "Pulled Pork Sandwich", price: 15.0 },
        { name: "Smoked Chicken Wings", price: 12.0 },
      ],
    },
  ];

  for (const update of updates) {
    try {
      // Query by name to find matching doc
      const snapshot = await restaurantsRef.where('name', '==', update.name).get();

      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id; // Assuming 'name' is unique
        await restaurantsRef.doc(docId).set({ menu: update.menu }, { merge: true });
        console.log(`Updated menu for ${update.name}, doc ID: ${docId}`);
      } else {
        console.warn(`No document found for name: ${update.name}`);
      }
    } catch (error) {
      console.error(`Error updating menu for ${update.name}:`, error);
    }
  }
}

updateMenus()
  .then(() => {
    console.log('Menus updated successfully.');
    process.exit(0); // Exit script on success
  })
  .catch((error) => {
    console.error('Error updating menus:', error);
    process.exit(1); // Exit script on error
  });