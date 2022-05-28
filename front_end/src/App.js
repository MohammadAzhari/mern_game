import React, { useState } from "react";
import Admin from "./screens/Admin";
import Game from "./screens/Game";
import Home from "./screens/Home";

function App() {
  const [home, setHome] = useState(true);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  return home ? (
    <Home
      code={code}
      setCode={setCode}
      setHome={setHome}
      name={name}
      setName={setName}
    />
  ) : name === "admin" && code === "admin" ? (
    <Admin />
  ) : (
    <Game code={code} name={name} />
  );
}

export default App;
