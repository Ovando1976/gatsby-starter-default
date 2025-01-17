const { getDocumentsFirestore, addDocumentFirestore } = require("../../../lib/documentsFirestore");

module.exports = async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET": {
        const docs = await getDocumentsFirestore();
        return res.status(200).json(docs);
      }

      case "POST": {
        const { title, description } = req.body;

        if (!title || typeof title !== "string") {
          return res.status(400).json({ error: "Title is required and must be a non-empty string" });
        }

        const newDoc = await addDocumentFirestore({
          title,
          description: description || "",
        });

        return res.status(201).json({
          success: true,
          message: "Document created successfully",
          document: newDoc,
        });
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("API Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};