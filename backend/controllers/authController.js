const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const SECRET = "secretkey";

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await userModel.getUsers();

    const exists = users.find(u => u.email === email);

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashed
    };

    const saved = userModel.addUser(newUser);

    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ message: "Signup error" });
  }
};

// LOGIN (IMPORTANT FIX)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await userModel.getUsers();

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};