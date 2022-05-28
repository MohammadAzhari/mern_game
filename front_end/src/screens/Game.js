import axios from "axios";
import React, { useEffect, useState } from "react";
// import { arrOfQuestions, randomQuestion } from "../utils/questions";
import io from "socket.io-client";
import Alert from "../components/Alert";
import { AlertState } from "../context/Err";
import { serverURI } from "../utils/serverURI";

const TIME = 60;
let socket;

export default function Game({ code, name }) {
  const [time, setTime] = useState(TIME);
  const [clicked, setClicked] = useState(false);
  const [users, setUsers] = useState([]);
  const [started, setStarted] = useState(false);
  const [deadTime, setDeadTime] = useState(TIME - 10);
  const [question, setQuestion] = useState({
    title: "",
    answers: [{ content: "", isTrue: true }],
  });
  const [gameOver, setGameOver] = useState(false);

  const { setErr, setErrMessage, err, errMessage } = AlertState();

  useEffect(() => {
    started && setTimeout(() => setTime(time - 1), 1000);
    if (time === deadTime) {
      socket.emit("correctAnswer", { name: "", code });
    }
    if (time <= 0) {
      socket.emit("gameOver", code);
    }
  }, [time]);

  useEffect(() => {
    socket = io(serverURI);
    socket.emit("join", { name, code });
  }, []);

  useEffect(() => {
    // here recive sockets
    socket.on("newPlayer", (newUsers) => {
      setUsers(newUsers);
    });
    //
    socket.on("start", (question) => {
      setStarted(true);
      setQuestion(question);
      setTime(TIME - 1);
      setDeadTime(TIME - 10);
      setGameOver(false);
      setClicked(false);
    });
    //
    socket.on("correctAnswer", ({ newUsers, question }) => {
      setUsers(newUsers);
      setQuestion(question);
      setDeadTime(time - 10);
      setClicked(false);
    });
    //
    socket.on("gameOver", () => {
      setStarted(false);
      setGameOver(true);
    });
  });

  const handleTrue = () => {
    socket.emit("correctAnswer", { name, code });
  };

  const handleFalse = () => {
    setClicked(true);
  };

  const handleStart = async () => {
    if (users.length > 1) {
      socket.emit("start", code);
      await axios.delete(serverURI + "/api/game/" + code);
    } else {
      setErrMessage("it must be 2 users at least to start");
      setErr(true);
    }
  };

  const handlePlayAgain = () => {
    socket.emit("start", code);
  };

  const questionContiner = (
    <div className="mt-4 p-4">
      <h3>{question.title}</h3>
      <div className="mt-5 row justify-content-between align-items-center">
        {question.answers.map((ans) => (
          <div className="col-md-3 col-sm-6">
            <button
              disabled={clicked}
              key={ans.content}
              className={clicked ? "btn-danger m-4 btn" : "btn-light m-4 btn"}
              onClick={ans.isTrue ? handleTrue : handleFalse}
            >
              {ans.content}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const usersContainer = users
    ? users.map((user) => {
        return (
          <div>
            <span className="bg-primary text-white ps-2 pe-2 rounded-pill">
              user name :
              <span className="text-white-50"> {user.playerName} </span>
            </span>
            <span className="bg-success text-white ps-2 pe-2  rounded-pill">
              score : <span className="text-white-50"> {user.score} </span>
            </span>
          </div>
        );
      })
    : null;

  const getWinner = () => {
    let bigger = 0;
    let winner = "";
    for (let user of users) {
      if (user.score > bigger) {
        bigger = user.score;
        winner = user.playerName;
      } else if (user.score === bigger) {
        winner += ` and ${user.playerName}`;
      }
    }
    return winner;
  };

  const gameOverContainer = (
    <div className="mt-5">
      <h3>Game Over</h3>
      <h5 className="text-success">
        the winner is <span className="text-warning">{getWinner()}</span>
      </h5>
      <div className="mt-3">
        <button className="btn btn-success" onClick={handlePlayAgain}>
          play again
        </button>
      </div>
    </div>
  );

  return (
    <div className="container">
      {err && <Alert setErr={setErr} message={errMessage} />}

      <div className="mt-5 d-flex justify-content-between align-items-center">
        <div className="m-3">{usersContainer}</div>
        <div className="m-3">
          <h2 className="text-success bg-white p-2">
            game code :<span className="text-primary"> {code} </span>
          </h2>
        </div>
        <div className="m-3 bg-warning rounded-pill p-3">
          time : <span className="text-secondary"> {time} </span>
        </div>
      </div>
      <div className="mt-5 p-5 bg-dark text-white text-center">
        {started ? (
          questionContiner
        ) : gameOver ? (
          gameOverContainer
        ) : (
          <div className="m-5">
            <button onClick={handleStart} className="mt-5 btn btn-success">
              start the game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
