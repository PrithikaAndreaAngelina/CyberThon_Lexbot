import 'dotenv/config';
import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request deduplication cache (stores recent reference numbers)
const recentSubmissions = new Set();
const DEDUPE_WINDOW_MS = 5000; // 5-second deduplication window

const uri = `mongodb+srv://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASS)}@cluster0.obdq5dy.mongodb.net/cybercrime?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

// Create unique index
async function setupDatabase() {
  try {
    const db = client.db();
    console.log(`Connected to database: ${db.databaseName}`);
    await db.collection("cybercases").createIndex(
      { referenceNumber: 1 },
      { unique: true }
    );
    console.log("Created unique index on referenceNumber");
  } catch (error) {
    console.error("Database setup error:", error);
    // Add this to see the full connection details:
    console.log("Connection URI:", uri);
  }
}

app.post('/api/complaints', async (req, res) => {
  const { referenceNumber } = req.body;
  
  // 1. Memory-based deduplication (fast check)
  if (recentSubmissions.has(referenceNumber)) {
    console.log(`Blocked duplicate request for ${referenceNumber}`);
    return res.status(429).json({
      success: false,
      message: "Duplicate submission detected"
    });
  }

  // 2. Database-level deduplication (strong check)
  try {
    const collection = client.db().collection("cybercases");
    const exists = await collection.findOne({ referenceNumber });
    
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Complaint already exists"
      });
    }

    // Store in memory cache
    recentSubmissions.add(referenceNumber);
    setTimeout(() => recentSubmissions.delete(referenceNumber), DEDUPE_WINDOW_MS);

    // Insert new complaint
    await collection.insertOne(req.body);
    res.status(201).json({
      success: true,
      message: "Complaint stored successfully"
    });

  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: "Duplicate complaint detected"
      });
    } else {
      console.error("Database error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to store complaint"
      });
    }
  }
});

// Add this GET endpoint for fetching complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const collection = client.db().collection("cybercases");
    const complaints = await collection.find().sort({ createdAt: -1 }).toArray(); // Get all complaints, newest first
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Error fetching complaints' });
  }
});

// Start server
async function start() {
  await client.connect();
  await setupDatabase();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start();