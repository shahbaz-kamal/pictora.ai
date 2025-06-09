const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get("/", () => {
  res.send("pictora.ai server is running");
});

app.listen(port, () => {
  console.log(`pictora ai server is running on port ${port}`);
});
