const mongoose = require("mongoose");

/* =========================
   LINK SCHEMA
========================= */
const linkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    url: {
      type: String,
      required: true,
      trim: true
    },

    // ⭐ FAVORITE SYSTEM
    favorite: {
      type: Boolean,
      default: false
    },

    // optional kung may user system ka
    user: {
      type: String,
      default: null
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Link", linkSchema);