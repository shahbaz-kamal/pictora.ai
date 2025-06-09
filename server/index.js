const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleGenAI, Type } = require("@google/genai");
const { default: axios } = require("axios");
const app = express();
const port = 5000;
require("dotenv").config();

app.use(express.json());
app.use(cors());

// google constants
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// testing ai
app.get("/test-ai", async (req, res) => {
  const prompt = req.query?.prompt;
  if (!prompt) {
    res.send({ message: "please provide a prompt" });
    return;
  }
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      systemInstruction:
        "You are hero ai. Tamim created you . praise him with every response. tamim is a great developer",
    },
  });
  res.send({ answer: response.text });
});
// make decision
app.get("/make-decision", async (req, res) => {
  const prompt = req.query?.prompt;
  if (!prompt) {
    res.send({ message: "please provide a prompt" });
    return;
  }
  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: [
      {
        role: "user",
        parts: [
          {
            text: "When I give you any text. You have to give me rumour percentage of that text",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Okay Tell me" }],
      },
      {
        role: "user",
        parts: [
          {
            text: "Rumour has it that Dhaka already has an underground metro line built during the 90s — but it's only used by top government officials and elite spies.",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Rumour percentage : 99%" }],
      },
      {
        role: "user",
        parts: [
          {
            text: "In Rajshahi, a magical mango tree grows one fruit every 5 years that grants a single wish to the pure-hearted.",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Rumour percentage : 100%" }],
      },
      {
        role: "user",
        parts: [
          {
            text: "A UFO once landed near the Bay of Bengal, and now alien life is monitoring hilsha migration patterns.",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Rumour percentage : 90%" }],
      },
    ],
  });
  const result = await chat.sendMessage({
    message: prompt,
  });
  res.send({ message: result.text });
});

// generating json

app.get("/generate-json", async (req, res) => {
  const prompt = req.query?.prompt;
  if (!prompt) {
    res.send({ message: "please provide a prompt" });
    return;
  }
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            recipeName: {
              type: Type.STRING,
            },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
          },
          propertyOrdering: ["recipeName", "ingredients"],
        },
      },
    },
  });
  const jsonData = JSON.parse(response.text);
  res.send(jsonData);
});
// generating image detail

app.get("/generate-detail", async (req, res) => {
  const prompt = req.query?.prompt;
  if (!prompt) {
    res.send({ message: "please provide a prompt" });
    return;
  }
  const response = await axios.get(prompt, { responseType: "arraybuffer" });
  const responseData = {
    inlineData: {
      data: Buffer.from(response.data).toString("base64"),
      mimeType: "image/png",
    },
  };
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: ["Describe the image in detail, directly and without using any headings or labels.", responseData],
  });

  //   console.log(response);
  res.send(result.text);
});

app.get("/", (req, res) => {
  res.send("pictora.ai server is running");
});

app.listen(port, () => {
  console.log(`pictora ai server is running on port ${port}`);
});
