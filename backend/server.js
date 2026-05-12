const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// AUTH ROUTES
app.use("/api/auth", require("./routes/authRoutes"));

// LINKS ROUTES (optional for next step)
app.use("/api/links", require("./routes/linkRoutes"));

app.get("/", (req, res) => {
  res.send("Link Saver API is running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

