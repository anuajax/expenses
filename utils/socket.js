const { Server } = require("socket.io");

const io = new Server({ 
    cors : {
        origin: "http://localhost:5000"
    }
});

io.on("connection", (socket) => {
  io.emit("firstevent", "Hello This is first event");
  socket.on("disconnect", () => {
      console.log("disconnected")
  })
});

io.listen(5000);