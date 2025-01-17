const { db, storage } = require('./firebaseAdmin');
const path = require('path');
const fs = require('fs');

async function uploadImageAndSaveUrl() {
  try {
    // Specify the local file path
    const localFilePath = path.join(__dirname, 'public', '3littlebirds.png');
    console.log('Resolved file path:', localFilePath);

    // Check if the file exists
    if (!fs.existsSync(localFilePath)) {
      throw new Error(`File not found at: ${localFilePath}`);
    }

    // Define the destination in Firebase Storage
    const destination = '3littlebirds/3littlebirds.png';

    // Upload the image to Firebase Storage
    await storage.upload(localFilePath, { destination });
    console.log('Image uploaded to Firebase Storage:', destination);

    // Make the file publicly accessible
    const file = storage.file(destination);
    await file.makePublic();
    const publicUrl = file.publicUrl();
    console.log('Public URL:', publicUrl);

    // Update Firestore with the public URL
    const restaurantsRef = db.collection('restaurants');
    const snapshot = await restaurantsRef
      .where('name', '==', '3Little Birds Bakeshop & Catering Service')
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await doc.ref.set({ imageUrl: publicUrl }, { merge: true });
      console.log(`Firestore doc updated with imageUrl: ${publicUrl}`);
    } else {
      console.log('No doc found for 3Little Birds Bakeshop & Catering Service.');
    }

    console.log('Completed upload and Firestore update.');
    process.exit(0);
  } catch (error) {
    console.error('Error uploading image or updating Firestore:', error);
    process.exit(1);
  }
}

uploadImageAndSaveUrl();