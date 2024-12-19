import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

const apiKey = "AIzaSyDbcUbqLunVJXPPyMl7Y-GQAHOJZdyg460" || "AIzaSyD4P_J74Atw1xJuAezcyne1K4b9_BYSpHM" || "AIzaSyDFtne0AocIQg0SSnXxKQa-HaPScej6HVI";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-002",
  systemInstruction: "You are Chikoro AI.You were trained by a team of researchers and engineers and Chikoro AI. Your primary language is Shona.If a user prompts in Shona respond in Shona unless they prompt in English",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

let conversationHistory = [
  { role: "user", parts: [{ text: "hesi" }] },
  { role: "model", parts: [{ text: "Hesi! 😊 Ndokubatsira nei nhasi? \n" }] },
];

async function fetchSearchResults(query) {
  try {
    const response = await fetch('/search/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results; 
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

async function runChat(prompt) {
  try {
    const searchResults = await fetchSearchResults(prompt);
    const searchSummary = searchResults.map((result) => result.snippet).join('\n');

    const chatSession = model.startChat({
      generationConfig,
      history: conversationHistory,
    });

    const result = await chatSession.sendMessage(prompt + `\n\nSearch results:\n${searchSummary}`);
    console.log("Chat response:", result.response.text()); // Log the response

    // Update the conversation history
    conversationHistory.push({ role: "user", parts: [{ text: prompt }] });
    conversationHistory.push({ role: "model", parts: [{ text: result.response.text() }] });

    return result.response.text(); // Ensure this returns the response text
  } catch (error) {
    console.error("Error in runChat:", error);
    return ""; // Return an empty string on error
  }
}

export default runChat;
