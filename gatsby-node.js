// gatsby-node.js
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const path = require("path");
const admin = require("firebase-admin");

exports.onCreateWebpackConfig = ({ actions, getConfig, stage }) => {
  const config = getConfig();

  // Ensure alias for firebaseConfig
  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    firebaseConfig: path.resolve(__dirname, "firebaseConfig.js"), // ✅ alias
  };

  if (stage === "develop" || stage === "build-javascript" || stage === "build-html") {
    config.plugins = config.plugins || [];
    config.plugins.push(new NodePolyfillPlugin({ excludeAliases: ["console"] }));

    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      events: require.resolve("events/"),
      process: require.resolve("process/browser.js"),
      querystring: false,
      child_process: false,
      fs: false,
      crypto: false,
      net: false,
      tls: false,
      assert: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      os: false,
      http2: false,
      "node:events": false,
      "node:process": false,
      "node:stream": false,
      "node:util": false,
    };
  }

  actions.replaceWebpackConfig(config);
};

// 🔐 Check env vars
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_STORAGE_BUCKET",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(`❌ Missing environment variables: ${missingVars.join(", ")}`);
  throw new Error("Required environment variables are missing. Check your .env file.");
} else {
  console.log("✅ All required environment variables are loaded.");
}

// 🔥 Firebase Admin init
let db;
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log("🚀 Firebase Admin initialized successfully.");
  } else {
    console.log("⚡ Firebase Admin already initialized.");
  }
  db = admin.firestore();
} catch (error) {
  console.error("🔥 Firebase Initialization Failed:", error);
  throw error;
}

// Schema customization
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type Restaurant implements Node {
      id: ID!
      name: String!
      description: String
    }
  `);
};

// Add client-only route for restaurants
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;
  if (page.path.match(/^\/restaurants/)) {
    page.matchPath = "/restaurants/*";
    createPage(page);
    console.log(`🔀 Added client-only route for ${page.path}`);
  }
};

// Build dynamic pages
exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  createPage({
    path: "/events",
    component: path.resolve("./src/templates/events-template.js"),
    context: { events: [], news: [] },
  });
  console.log("📅 Created static /events page.");

  try {
    const snapshot = await db.collection("restaurants").get();
    const restaurantDocs = snapshot.docs;

    if (restaurantDocs.length === 0) {
      console.warn("⚠️ No restaurant data found in Firestore.");
      return;
    }

    await Promise.all(
      restaurantDocs.map(async (doc) => {
        createPage({
          path: `/restaurants/${doc.id}`,
          component: path.resolve("./src/templates/restaurant-template.js"),
          context: { id: doc.id },
        });
        console.log(`🍽️ Created page for restaurant: ${doc.id}`);
      })
    );

    console.log(`✅ Successfully created ${restaurantDocs.length} restaurant pages.`);
  } catch (error) {
    console.error("🔥 Error fetching restaurants for page creation:", error);
    throw error;
  }
};