import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const port = 3000;

// MongoDB connection URI
const uri = "mongodb+srv://ronaldbvirinyangwe:Ia4zlauEbL6S5uYh@authentication.mzuydgr.mongodb.net/?retryWrites=true&w=majority&appName=authentication";
const client = new MongoClient(uri);

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

app.post('/search', async (req, res) => {
  const { query } = req.body;

  try {
    await client.connect();
    const database = client.db("history"); // Replace with your database name
    const collection = database.collection("history");

    // Check if the results are already in the database
    const existingResult = await collection.findOne({ query });
    if (existingResult) {
      console.log("Returning cached results from MongoDB.");
      return res.json({ results: existingResult.results });
    }

    // Fetch results from Google Custom Search API
    const customSearchApiKey = "AIzaSyCnvM9marRKHXOh7TJBCXRuSypwJWq4wpM";
    const cx = "122c61a18e46b44f5";
    const url = `https://www.googleapis.com/customsearch/v1?key=${customSearchApiKey}&cx=${cx}&q=${query}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const results = data.items || [];

    // Save results to MongoDB
    await collection.insertOne({ query, results });

    res.json({ results });
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close(); // Ensure the client is closed after the operation
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
