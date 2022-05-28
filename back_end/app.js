const express = require("express");
const http = require("http");
const socketServer = require("./socket.server");
const mongoose = require("mongoose");
const { MONGO_URI, CLIENT_URI } = require("./config");
const cors = require("cors");

const app = express();

mongoose.connect(MONGO_URI, () => {
  console.log("connected to mongo db");
});

app.use(express.json());

app.use(cors());

app.use("/api", require("./routes/api"));

const server = http.createServer(app);

const socketIO = require("socket.io");
const io = socketIO(server, {
  cors: {
    origin: CLIENT_URI,
  },
});

socketServer(io);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log("api is runnig");
});
