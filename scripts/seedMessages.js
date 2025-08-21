// scripts/seedMessages.js
const admin = require("firebase-admin");
const path = require("path");

function initAdmin() {
  // 1) If you have a service account file locally, use it
  const saPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(__dirname, "..", "./serviceAccountKey.json");

  if (!admin.apps.length) {
    try {
      // Load SA if it exists
      let cred;
      try {
        const sa = require(saPath);
        cred = admin.credential.cert(sa);
        admin.initializeApp({ credential: cred, projectId: sa.project_id });
        return;
      } catch {
        // Fall back to ADC (gcloud auth application-default login)
        admin.initializeApp();
      }
    } catch (e) {
      console.error("Firebase Admin init failed:", e.message);
      process.exit(1);
    }
  }
}

initAdmin();

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

// ---- CLI args, data, and seeding below stays the same ----
const roomId = process.argv[2] || "default-room";
const count = Number(process.argv[3] || 5);

const senders = ["Alice", "Bob", "Carla", "Diego", "Eve", "Frank"];
const texts = [
  "Hello world 👋",
  "How’s the build going?",
  "Shipping Stage 4 ✅",
  "Firestore seed works!",
  "Dark mode looks great.",
  "Collapsing the rail now.",
];

function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

async function seed() {
  console.log(`Seeding ${count} message(s) into chatRooms/${roomId}/messages …`);

  const colRef = db.collection("chatRooms").doc(roomId).collection("messages");
  const batch = db.batch();

  for (let i = 0; i < count; i++) {
    const docRef = colRef.doc();
    batch.set(docRef, {
      userId: `TEST_${pick(senders).toUpperCase()}`,
      sender: pick(senders),
      preview: pick(texts),
      timestamp: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log("Done ✅");
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});