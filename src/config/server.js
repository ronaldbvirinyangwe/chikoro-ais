import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const corsOptions = {
  origin: 'http://13.246.95.40:5173',
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions)); // Enable CORS with the specified options
app.use(express.json());

const uri = "mongodb+srv://ronaldbvirinyangwe:Ia4zlauEbL6S5uYh@authentication.mzuydgr.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=authentication";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

const apiKey = "AIzaSyDbcUbqLunVJXPPyMl7Y-GQAHOJZdyg460";
const genAI = new GoogleGenerativeAI(apiKey);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongoDB();

app.post('/generate-response', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await runChat(prompt); // Import and call the runChat function from gemini.js
    res.json({ message: response });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ message: 'Error generating response' });
  }
});

app.get('/embed-conversation', async (req, res) => {
  try {
    const conversationHistory = req.body.conversationHistory;
    const model = genAI.getGenerativeModel({ model: "text-embedding-004"});
    const conversationEmbeddings = [];

    for (const message of conversationHistory) {
      for (const part of message.parts) {
        const text = part.text;
        const result = await model.embedContent(text);
        const embedding = result.embedding;
        conversationEmbeddings.push({
          text: text,
          embedding: embedding.values
        });
      }
    }

    const db = client.db("mydatabase");
    const collection = db.collection("vectordb");
    await collection.insertMany(conversationEmbeddings);
    res.json({ message: 'Conversation history embedded successfully' });
  } catch (error) {
    console.error('Error embedding conversation:', error);
    res.status(500).json({ message: 'Error embedding conversation' });
  }
});

app.listen(5190, () => {
  console.log('Server started on port 5190');
});
