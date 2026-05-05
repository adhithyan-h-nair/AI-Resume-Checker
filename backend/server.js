const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

app.post("/upload", upload.single("resume"), (req, res) => {
  console.log(req.file);
  res.json({
    message: "File received",
    fileName: req.file.originalname,
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});