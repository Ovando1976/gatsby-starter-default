// src/utils/firebaseClient.js

export async function getFirebase() {
    if (typeof window !== "undefined") {
      const { initializeApp, getApps } = await import("firebase/app");
      const { getFirestore } = await import("firebase/firestore");
      const { getAuth } = await import("firebase/auth");
      // or whichever modules you need
  
      const config = {
        apiKey: process.env.GATSBY_FIREBASE_API_KEY,
        authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
        // ...
      };
      let app;
      if (!getApps().length) {
        app = initializeApp(config);
      } else {
        app = getApps()[0];
      }
      return {
        app,
        db: getFirestore(app),
        auth: getAuth(app),
        // ...
      };
    }
    // If SSR, just return null or an empty object so it won't crash
    return {};
  }