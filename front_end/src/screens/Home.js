import React, { useState } from "react";
import Alert from "../components/Alert";
import genrateRandomCode from "../utils/randomCode";
import { AlertState } from "../context/Err";
import axios from "axios";
import { serverURI } from "../utils/serverURI";

function Home({ setHome, code, setCode, name, setName }) {
  const [join, setJoin] = useState(false);

  const { setErr, setErrMessage, err, errMessage } = AlertState();

  const handleJoin = async () => {
    if (name === "" || code === "") {
      setErrMessage("empty field");
      setErr(true);
    } else if (name === "admin" && code === "admin") {
      setHome(false);
    } else {
      try {
        const { data } = await axios.get(serverURI + "/api/game/" + code);
        if (data === "ok") {
          setHome(false);
        } else {
          setErrMessage(data);
          setErr(true);
        }
      } catch (error) {
        setErrMessage("game is not found!");
        setErr(true);
      }
    }
  };

  const handleCreate = async () => {
    if (name === "") {
      setErrMessage("name is required");
      setErr(true);
      return;
    }
    let randomCode = genrateRandomCode(5);
    setCode(randomCode);
    try {
      await axios.post(serverURI + "/api/game", { code: randomCode });
      setHome(false);
    } catch (error) {
      setErrMessage("error occurred");
      setErr(true);
    }
  };

  return (
    <div className="container text-center">
      {err && <Alert setErr={setErr} message={errMessage} />}
      <div className="mt-5">
        <h1 className="text-white ms-5">
          welcome to <span className="text-warning"> Renswer </span>
        </h1>
      </div>

      <div className="card ms-5 me-5 rounded-pill p-2 mt-5 bg-primary text-warning ">
        <div className="mt-5">
          <h2>create of join a game</h2>
        </div>
        <div className="row m-5">
          <div className="col-md-12">
            <center>
              <input
                className="form-control mb-5 w-50"
                placeholder="enter your nickName"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <button
                    className={`btn ${!join ? "btn-warning" : "btn-danger"}`}
                    onClick={() => setJoin(!join)}
                  >
                    {!join ? <span>join to game</span> : <span> cancle </span>}
                  </button>
                </div>
                <div className="col-md-6 col-sm-12 mt-2">
                  <button
                    className="btn btn-success ms-3"
                    onClick={handleCreate}
                  >
                    create a game
                  </button>
                </div>
              </div>

              {join && (
                <div className="mt-3 d-flex justify-content-center align-items-center">
                  <input
                    type="text"
                    className="form-control w-50"
                    placeholder="enter game code"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                    }}
                  />
                  <button className="btn btn-info ms-2" onClick={handleJoin}>
                    join
                  </button>
                </div>
              )}
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
