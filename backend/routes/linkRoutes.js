const express = require("express");
const router = express.Router();
const axios = require("axios");

const auth = require("../middleware/authMiddleware");

const BASE_URL = "http://localhost:3001/links";

// GET LINKS (PER USER)
router.get("/", auth, async (req, res) => {
  const response = await axios.get(BASE_URL);

  const userLinks = response.data.filter(
    l => l.userId === req.user.id
  );

  res.json(userLinks);
});

// CREATE LINK
router.post("/", auth, async (req, res) => {
  const newLink = {
    title: req.body.title,
    url: req.body.url,
    userId: req.user.id
  };

  const response = await axios.post(BASE_URL, newLink);
  res.json(response.data);
});

// UPDATE LINK
router.put("/:id", auth, async (req, res) => {
  const response = await axios.put(
    `${BASE_URL}/${req.params.id}`,
    req.body
  );

  res.json(response.data);
});

// DELETE LINK
router.delete("/:id", auth, async (req, res) => {
  await axios.delete(`${BASE_URL}/${req.params.id}`);

  res.json({ message: "Deleted" });
});

module.exports = router;