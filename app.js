const express = require("express");

const app = express();

const cors = require("cors");

const http = require("http");

const { Server } = require("socket.io");



const port = 5000;



// CORS

app.use(cors());

app.use(express.json());



// HTTP SERVER

const server = http.createServer(app);



// SOCKET.IO

const io = new Server(server, {

  cors: {
    origin: "*"
  }

});



// GLOBAL IO

global.io = io;





// MQTT

require("./mqtt");



// ROUTER

const route = require("./router");

app.use("/api", route);





// SOCKET CONNECT

io.on("connection", (socket) => {

  console.log(
    "Frontend Connected"
  );

});





// SERVER START

server.listen(port, () => {

  console.log(
    `server running ${port}`
  );

});