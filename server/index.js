const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const port = 5000;
require("dotenv").config();

app.use(express.json());
app.use(cors());

// google constants
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
// testing ai
app.get("/test-ai", async (req, res) => {
  const prompt = "Explain how ai works";
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  res.send({answer:result.response.text()})
});

app.get("/", (req, res) => {
  res.send("pictora.ai server is running");
});

app.listen(port, () => {
  console.log(`pictora ai server is running on port ${port}`);
});
