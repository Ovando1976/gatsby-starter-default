// firebase.js - Retrieving data
import { doc, getDoc,setDoc } from "firebase/firestore";
import { db } from '../../firebaseConfig';


export const addDriverData = async (driverData) => {
  try {
    const docRef = doc(db, "drivers", driverData.licenseNumber); // Use licenseNumber as document ID
    await setDoc(docRef, driverData);
    console.log("Driver data added successfully!");
  } catch (e) {
    console.error("Error adding driver data: ", e);
  }
};

export const getDriverData = async (licenseNumber) => {
  try {
    const docRef = doc(db, "drivers", licenseNumber);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Driver data:", docSnap.data());
      return docSnap.data(); // Return the driver data
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting driver data: ", e);
    return null;
  }
};