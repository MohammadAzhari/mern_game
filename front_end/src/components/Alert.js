import React from "react";
import "../main.css";

export default function Alert({ message, setErr }) {
  return (
    <div className="myCover">
      <div className="myAlert">
        <div
          className="bg-danger text-white rounded-pill p-4"
          style={{ position: "relative", zIndex: 10000 }}
        >
          {message}
          <button
            onClick={() => {
              setErr(false);
            }}
            className="ms-5 btn-warning btn rounded-circle"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}
