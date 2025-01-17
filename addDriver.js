const db = require('./firebaseAdmin'); // Import Firestore instance

const driverData = {
  name: "John Doe",
  address: "123 Main Street, Charlotte Amalie, St. Thomas, USVI",
  dateOfBirth: "01/15/1985",
  licenseNumber: "USVI123456789",
  expirationDate: "01/15/2030",
  organDonor: true,
  photo: "https://example.com/john-doe-photo.jpg",
  signature: "https://example.com/john-doe-signature.jpg",
  vehicle: "Toyota Supra",
  rating: 4.9
};

const addDriver = async (driverData) => {
  try {
    const docRef = db.collection('drivers').doc(driverData.licenseNumber); // Using licenseNumber as doc ID
    await docRef.set(driverData); // Set the data in Firestore
    console.log(`Driver ${driverData.name} added successfully!`);
  } catch (error) {
    console.error('Error adding driver:', error);
  }
};

addDriver(driverData);