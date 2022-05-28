const { randomQuestion } = require("./utils/questions");
const Question = require("./model/questions.model");

module.exports = (io) => {
  //
  let questions;
  //
  io.on("connection", (socket) => {
    //
    socket.on("join", (data) => {
      const { name, code } = data;
      if (!io[code]) io[code] = [];
      socket.join(code);
      console.log(`${name} is joind to ${code}`);
      let isExist = false;
      if (io[code].length > 0) {
        io[code].forEach((user) => {
          if (user.playerName == name) isExist = true;
        });
      }
      !isExist && io[code].push({ playerName: name, score: 0 });
      socket.to(code).emit("newPlayer", io[code]);
    });
    //
    socket.on("start", async (code) => {
      questions = await Question.find();
      let question = randomQuestion(questions);
      socket.to(code).emit("start", question);
    });
    //
    socket.on("correctAnswer", async (data) => {
      const { name, code } = data;
      io[code].forEach((user) => {
        if (user.playerName == name) {
          user.score++;
        }
      });
      let question = randomQuestion(questions);
      socket.to(code).emit("correctAnswer", { newUsers: io[code], question });
    });
    //
    socket.on("gameOver", (code) => {
      socket.to(code).emit("gameOver");
    });
  });
};
