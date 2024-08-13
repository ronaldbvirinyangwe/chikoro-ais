/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mediaPath = __dirname + "/media";

const apiKey = "AIzaSyDbcUbqLunVJXPPyMl7Y-GQAHOJZdyg460";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: "You are Chikoro AI.You were trained by a team of engineers and researchers at Chikoro AI. Your primary goal is to assist students with their homework and other various tasks",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Utility function to convert file to generative part
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

async function runChat(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  console.log(result.response.text());
  return result.response.text();
}

async function textGenTextOnlyPrompt() {
  const prompt = "Write a story about a magic backpack.";
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}

async function textGenTextOnlyPromptStreaming() {
  const prompt = "Write a story about a magic backpack.";
  const result = await model.generateContentStream(prompt);

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
}

async function textGenMultimodalOneImagePrompt() {
  const prompt = "Describe how this product might be manufactured.";
  const imagePart = fileToGenerativePart(`${mediaPath}/jetpack.jpg`, "image/jpeg");
  const result = await model.generateContent([prompt, imagePart]);
  console.log(result.response.text());
}

async function textGenMultimodalOneImagePromptStreaming() {
  const prompt = "Describe how this product might be manufactured.";
  const imagePart = fileToGenerativePart(`${mediaPath}/jetpack.jpg`, "image/jpeg");
  const result = await model.generateContentStream([prompt, imagePart]);

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
}

async function textGenMultimodalMultiImagePrompt() {
  const prompt =
    "Write an advertising jingle showing how the product in the" +
    " first image could solve the problems shown in the second two images.";

  const imageParts = [
    fileToGenerativePart(`${mediaPath}/jetpack.jpg`, "image/jpeg"),
    fileToGenerativePart(`${mediaPath}/piranha.jpg`, "image/jpeg"),
    fileToGenerativePart(`${mediaPath}/firefighter.jpg`, "image/jpeg"),
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  console.log(result.response.text());
}

async function textGenMultimodalMultiImagePromptStreaming() {
  const prompt =
    "Write an advertising jingle showing how the product in the" +
    " first image could solve the problems shown in the second two images.";

  const imageParts = [
    fileToGenerativePart(`${mediaPath}/jetpack.jpg`, "image/jpeg"),
    fileToGenerativePart(`${mediaPath}/piranha.jpg`, "image/jpeg"),
    fileToGenerativePart(`${mediaPath}/firefighter.jpg`, "image/jpeg"),
  ];

  const result = await model.generateContentStream([prompt, ...imageParts]);

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
}

async function textGenMultimodalAudio() {
  const prompt = "Give me a summary of this audio file.";
  const audioPart = fileToGenerativePart(`${mediaPath}/samplesmall.mp3`, "audio/mp3");
  const result = await model.generateContent([prompt, audioPart]);
  console.log(result.response.text());
}

async function textGenMultimodalVideoPrompt() {
  const fileManager = new GoogleAIFileManager(apiKey);

  const uploadResult = await fileManager.uploadFile(
    `${mediaPath}/Big_Buck_Bunny.mp4`,
    { mimeType: "video/mp4" },
  );

  let file = await fileManager.getFile(uploadResult.file.name);
  while (file.state === FileState.PROCESSING) {
    process.stdout.write(".");
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    file = await fileManager.getFile(uploadResult.file.name);
  }

  if (file.state === FileState.FAILED) {
    throw new Error("Video processing failed.");
  }

  const prompt = "Describe this video clip";
  const videoPart = {
    fileData: {
      fileUri: uploadResult.file.uri,
      mimeType: uploadResult.file.mimeType,
    },
  };

  const result = await model.generateContent([prompt, videoPart]);
  console.log(result.response.text());
  await fileManager.deleteFile(uploadResult.file.name);
}

async function textGenMultimodalVideoPromptStreaming() {
  const fileManager = new GoogleAIFileManager(apiKey);

  const uploadResult = await fileManager.uploadFile(
    `${mediaPath}/Big_Buck_Bunny.mp4`,
    { mimeType: "video/mp4" },
  );

  let file = await fileManager.getFile(uploadResult.file.name);
  while (file.state === FileState.PROCESSING) {
    process.stdout.write(".");
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    file = await fileManager.getFile(uploadResult.file.name);
  }

  if (file.state === FileState.FAILED) {
    throw new Error("Video processing failed.");
  }

  const prompt = "Describe this video clip";
  const videoPart = {
    fileData: {
      fileUri: uploadResult.file.uri,
      mimeType: uploadResult.file.mimeType,
    },
  };

  const result = await model.generateContentStream([prompt, videoPart]);

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
  await fileManager.deleteFile(uploadResult.file.name);
}

async function runAll() {
  // Comment out or delete any sample cases you don't want to run.
  await runChat("Tell me a joke.");
  await textGenTextOnlyPrompt();
  await textGenTextOnlyPromptStreaming();
  await textGenMultimodalOneImagePrompt();
  await textGenMultimodalOneImagePromptStreaming();
  await textGenMultimodalMultiImagePrompt();
  await textGenMultimodalMultiImagePromptStreaming();
  await textGenMultimodalAudio();
  await textGenMultimodalVideoPrompt();
  await textGenMultimodalVideoPromptStreaming();
}

runAll();
