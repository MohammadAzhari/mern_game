const express = require("express");
const router = express.Router();
const Question = require("../model/questions.model");
const Game = require("../model/game.model");
const randomize = require("../utils/randomize");

router.get("/questions", async (req, res) => {
  try {
    const allQustions = await Question.find();
    res.status(200).send(allQustions);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.post("/questions", async (req, res) => {
  const { title, answers } = req.body;
  if (!title || answers.length < 2) {
    return res.status(400);
  } else {
    try {
      let filterdAnswers = await randomize(answers);
      const question = await Question.create({
        title,
        answers: filterdAnswers,
      });
      res.status(200).send(question);
    } catch (error) {
      console.log(error);
      res.status(500);
    }
  }
});

router.delete("/questions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findByIdAndDelete(id);
    res.status(200).send(question);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.get("/game/:code", async (req, res) => {
  const { code } = req.params;
  try {
    let game = await Game.findOne({ code });
    if (!game) {
      return res.status(404).send("game is not found!");
    } else res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.post("/game", async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400);
  }
  try {
    await Game.create({ code });
    res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.delete("/game/:code", async (req, res) => {
  const { code } = req.params;
  try {
    await Game.deleteOne({ code });
    res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.get("/see_games", async (req, res) => {
  let games = await Game.find();
  res.json(games);
});

module.exports = router;
