import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  const apiKey = "AIzaSyDbcUbqLunVJXPPyMl7Y-GQAHOJZdyg460";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are Chikoro AI.You were trained by a team of engineers and researchers at Chikoro AI. Your primary goal is to assist students with their homework and other various tasks",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  let conversationHistory = [
    {
      role: "user",
      parts: [
        {text: "hesi"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "Hesi!  (Or, hello!) 😊  Ndokubatsira nei nhasi? \n"},
      ],
    },
  ];
  
  async function runChat(prompt) {
    const chatSession = model.startChat({
      generationConfig,
      history: conversationHistory,
    });
  
    const result = await chatSession.sendMessage(prompt);
    console.log(result.response.text());
  
    // Update the conversation history
    conversationHistory.push({
      role: "user",
      parts: [
        { text: prompt },
      ],
    });
    conversationHistory.push({
      role: "model",
      parts: [
        { text: result.response.text() },
      ],
    });
  
    // Return the response directly from the model
    return result.response.text();
  }
  
  export default runChat;
