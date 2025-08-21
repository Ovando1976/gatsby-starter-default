// seeds messages into multiple rooms
// Usage: node scripts/seedRooms.js           -> seeds default set
//        node scripts/seedRooms.js lounge 10 -> seeds 10 in "lounge"

const admin = require("firebase-admin");
const path = require("path");

function initAdmin() {
  const saPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(__dirname, "..", "./serviceAccountKey.json");
  if (!admin.apps.length) {
    const sa = require(saPath);
    admin.initializeApp({
      credential: admin.credential.cert(sa),
      projectId: sa.project_id,
    });
  }
}
initAdmin();

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const defaultRooms = ["default-room", "lounge", "dev-room"];
const rooms = process.argv[2] ? [process.argv[2]] : defaultRooms;
const count = Number(process.argv[3] || 6);

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

async function seedRoom(roomId) {
  console.log(`→ Seeding ${count} messages in room: ${roomId}`);
  const colRef = db.collection("chatRooms").doc(roomId).collection("messages");
  const batch = db.batch();
  for (let i = 0; i < count; i++) {
    const docRef = colRef.doc();
    batch.set(docRef, {
      userId: `TEST_${pick(senders).toUpperCase()}`,
      sender: pick(senders),
      preview: pick(texts),
      text: pick(texts),
      timestamp: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
}

async function run() {
  for (const r of rooms) {
    await seedRoom(r);
  }
  console.log("Done ✅");
}

run().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});