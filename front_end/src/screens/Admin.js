import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverURI } from "../utils/serverURI";
import { AlertState } from "../context/Err";
import Alert from "../components/Alert";

export default function Admin() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [correct, setCorrect] = useState("");
  const [wrongs, setWrongs] = useState([]);
  const [wrong, setWrong] = useState("");

  const { setErr, setErrMessage, err, errMessage } = AlertState();

  const refrechPage = async () => {
    try {
      const { data } = await axios.get(serverURI + "/api/questions");
      setQuestions(data);
    } catch (error) {
      setErrMessage("cannot connect with the api!");
      setErr(true);
    }
  };

  useEffect(() => {
    refrechPage();
  }, []);

  const reset = () => {
    setTitle("");
    setCorrect("");
    setWrongs([]);
    setWrong("");
  };

  const handleWrong = () => {
    wrong !== "" && setWrongs([...wrongs, wrong]);
    setWrong("");
  };

  const handleSubmit = async () => {
    let answers = [{ content: correct, isTrue: true }];
    for (let ans of wrongs) {
      answers.push({ content: ans, isTrue: false });
    }
    if (title === "" || correct === "") {
      setErrMessage("please fill all fields");
      setErr(true);
      return;
    }
    if (answers.length < 2) {
      setErrMessage("wrong answers are required");
      setErr(true);
      return;
    }
    const question = {
      title,
      answers,
    };
    reset();
    try {
      const { data } = await axios.post(serverURI + "/api/questions", question);
      setQuestions([...questions, data]);
    } catch (error) {
      setErrMessage("error occurred");
      setErr(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        serverURI + "/api/questions" + "/" + id
      );
      let newQuestions = questions.filter((item) => item._id !== data._id);
      setQuestions(newQuestions);
    } catch (error) {
      setErrMessage("error occurred");
      setErr(true);
    }
  };

  const questionsTable =
    questions.length > 0 ? (
      questions.map((q, i) => {
        return (
          <tr key={i}>
            <th> {q.title} </th>
            <td> {q._id} </td>
            <td>
              <button
                className="btn btn-danger"
                onClick={() => {
                  handleDelete(q._id);
                }}
              >
                delete
              </button>
            </td>
          </tr>
        );
      })
    ) : (
      <p> there is no questions to show </p>
    );

  return (
    <div className="container mt-5">
      {err && <Alert setErr={setErr} message={errMessage} />}
      <div className="row mt-5">
        <div className="col-lg-6 col-md-12">
          <center>
            <div className="card bg-primary text-white">
              <div className="alert alert-secondary" role="alert">
                <span>this is the list of questions</span>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>question title</th>
                    <th>q id</th>
                    <th> X </th>
                  </tr>
                </thead>
                <tbody>{questionsTable}</tbody>
              </table>
            </div>
          </center>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className=" p-5 bg-dark text-white text-center">
            <div className="mt-4 p-4">
              <h3>{title}</h3>
              <div className=" row justify-content-between align-items-center">
                <div className="col-3">
                  {correct !== "" && (
                    <button className="btn btn-success">{correct}</button>
                  )}
                </div>
                {wrongs.map((ans) => (
                  <div className="col-3" key={ans}>
                    <button className="btn btn-danger">{ans}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="alert alert-secondary" role="alert">
            add new question
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <label for="floatingInput">question title</label>
            </div>
            <div class="form-floating">
              <input
                type="text"
                className="form-control"
                value={correct}
                onChange={(e) => {
                  setCorrect(e.target.value);
                }}
              />
              <label for="floatingInput">correct answer</label>
            </div>
            <div class="form-floating d-flex mt-1 w-75">
              <input
                type="text"
                className="form-control"
                value={wrong}
                onChange={(e) => {
                  setWrong(e.target.value);
                }}
              />
              <label for="floatingInput">wrong answer</label>
              <button
                className="btn btn-warning rounded-circle ms-2"
                onClick={handleWrong}
              >
                +
              </button>
            </div>
            <button className="btn btn-primary mt-5" onClick={handleSubmit}>
              add question to DB
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
