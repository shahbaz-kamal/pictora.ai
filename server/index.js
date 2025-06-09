const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleGenAI } = require("@google/genai");
const app = express();
const port = 5000;
require("dotenv").config();

app.use(express.json());
app.use(cors());

// google constants
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// testing ai
app.get("/test-ai", async (req, res) => {
  //   const prompt = req.query?.prompt;
  //   if (!prompt) {
  //     res.send({ message: "please provide a prompt" });
  //     return;
  //   }
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Do you know programming hero?",
  });
  res.send({ answer: response.text });
});

app.get("/", (req, res) => {
  res.send("pictora.ai server is running");
});

app.listen(port, () => {
  console.log(`pictora ai server is running on port ${port}`);
});
