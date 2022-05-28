const randomQuestion = (questions) => {
  let length = questions.length - 1;
  let randomNum = Math.floor(Math.random() * length);
  return questions[randomNum];
};

module.exports = { randomQuestion };
