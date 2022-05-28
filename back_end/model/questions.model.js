const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: { type: String },
  answers: [
    {
      content: {
        type: String,
      },
      isTrue: {
        type: Boolean,
      },
    },
  ],
});

module.exports = mongoose.model("Question", schema);
