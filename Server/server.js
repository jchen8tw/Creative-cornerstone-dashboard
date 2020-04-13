const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// fake DB
const db = {
  rank: {
    1: { name: "Team 1", point: 100 },
    2: { name: "Team 2", point: 50 },
    3: { name: "Team 3", point: 10 },
  },
  current_team: "Team 1",
  time_remaining: 20,
  status: {
    gamemode: 1,
    //point of current team
    point: 100,
  },
  cur_game_countdown: null,
};

// socket.io server
io.on("connection", (socket) => {
  socket.on("message", (data) => {
    console.log(data);
    //messages.push(data)
    socket.emit("message", data);
  });
  socket.on("start_game", (data) => {
    if (!db.cur_game_countdown) {
      io.emit("game_started");
      db.cur_game_countdown = setInterval(() => {
        if (db.time_remaining > 0) {
          db.time_remaining = db.time_remaining - 1;
          if (db.time_remaining % 5 === 0) {
            io.emit("update_time", { time_remaining: db.time_remaining });
          }
        } else {
          io.emit("game_end");
          clearInterval(db.cur_game_countdown);
          db.cur_game_countdown = null;
          db.time_remaining = 20;
        }
      }, 1000);
    } else {
      socket.emit("game_already_started");
    }
  });
});

nextApp.prepare().then(() => {
  app.get("/messages", (req, res) => {
    res.json(messages);
  });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
