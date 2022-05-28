import React, { createContext, useContext, useState } from "react";

const ErrAlert = createContext();

export default function Err({ children }) {
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  return (
    <ErrAlert.Provider
      value={{
        setErr,
        setErrMessage,
        err,
        errMessage,
      }}
    >
      {children}
    </ErrAlert.Provider>
  );
}

export const AlertState = () => {
  return useContext(ErrAlert);
};
