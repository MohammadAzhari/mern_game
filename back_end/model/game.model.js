const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  code: {
    type: String,
  },
});

module.exports = mongoose.model("Game", schema);
