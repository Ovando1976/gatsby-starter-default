require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const admin = require("firebase-admin");

// Create a service account object using your environment variables
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  // Replace literal "\n" with actual newline characters
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

// Initialize the Firebase Admin app if it hasn't been already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Get the Firestore instance and set the timestamps setting
const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

module.exports = {
  siteMetadata: {
    title: `USVIexplorer`,
    description: `Discover the best of USVI with our AI-powered social platform.`,
    author: `@yourusername`,
  },
  plugins: [
    `gatsby-plugin-postcss`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/posts`,
      },
    },
    // gatsby-source-firestore has been removed since data is sourced directly.
  ],
};