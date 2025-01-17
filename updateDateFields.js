// updateDateFields.js

const { admin, db } = require("./firebaseAdmin"); // Adjust the path if necessary

async function updateDateFields() {
  try {
    // Reference to the 'articles' collection
    const articlesRef = db.collection("articles");

    // Fetch all documents in the 'articles' collection
    const snapshot = await articlesRef.get();

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      // Check if 'date' is a string
      if (typeof data.date === "string") {
        const parsedDate = new Date(data.date);

        // Validate the parsed date
        if (isNaN(parsedDate)) {
          console.warn(`Invalid date format for post ID: ${docSnap.id}. Skipping...`);
          continue;
        }

        const newTimestamp = admin.firestore.Timestamp.fromDate(parsedDate);

        // Update the 'date' field to Timestamp
        await docSnap.ref.update({ date: newTimestamp });
        console.log(`Updated 'date' for post ID: ${docSnap.id}`);
      } else {
        console.log(`Post ID: ${docSnap.id} already has a Timestamp 'date'. Skipping...`);
      }
    }

    console.log("All applicable 'date' fields have been updated.");
  } catch (error) {
    console.error("Error updating date fields:", error);
  }
}

// Execute the update
updateDateFields();