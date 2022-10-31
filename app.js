const express = require("express");
const app = express();
const path = require("path");
const socketIO = require("socket.io");
let rooms = ["grupo1", "grupo2"];
rooms.forEach((item) => {
  app.use(`/${item}`, express.static(path.join(__dirname, "public")));
});

app.use("/", express.static(path.join(__dirname, "public")));

const server = app.listen(3000, () => {
  console.log("Server running...");
});

const io = socketIO(server);
let messages = [];
let users = [];
rooms.forEach((item) => {
  io.of(`/${item}`).on("connection", (socket) => {
    console.log("New connection");

    io.of(`${item}`).emit("updateMessages", { messages });

    socket.on("createMessage", (data) => {
      messages.push(data);

      io.of(`${item}`).emit("updateMessages", { messages });
    });

    socket.on("warning", (data) => {
      let item = users.find((e) => {
        return e == data.user;
      });

      if (item) {
        socket.emit("exists");
      } else {
        users.push(data.user);
        socket.emit("delete");
        socket.broadcast.emit("loggedUser", { user: data.user });
      }
    });
  });
});
