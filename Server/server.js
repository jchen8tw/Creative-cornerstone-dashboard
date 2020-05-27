const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
//uids
const uids = require("./data/uid.json");
const sequence = require("./data/sequence.json");
const GAME_TIME = 120;
// fake DB
const db = {
    history: {
        0: {
            //time format: Mon May 18 2020 15:47:16
            // "Team 1": {
            //     point: 100,
            //     last_eaten_time: 0,
            //     time: new Date().toString().slice(0, 24),
            // },
            // "Team 2": {
            //     point: 50,
            //     last_eaten_time: 0,
            //     time: new Date().toString().slice(0, 24),
            // },
            // "Team 3": {
            //     point: 10,
            //     last_eaten_time: 0,
            //     time: new Date().toString().slice(0, 24),
            // },
        },
        1: {
            // "Team 4": {
            //     point: 100,
            //     last_eaten_time: 0,
            //     time: new Date().toString().slice(0, 24),
            // },
            // "Team 5": {
            //     point: 50,
            //     last_eaten_time: 0,
            //     time: new Date().toString().slice(0, 24),
            // },
            // "Team 6": {
            //     point: 10,
            //     last_eaten_time: 0,
            //     time: new Date().toString().slice(0, 24),
            // },
        },

        //
    },
    //current_team: "Team 1"
    current_team: null,
    time_remaining: GAME_TIME,
    status: {
        gamemode: null,
        //point of current team
        point: 0,
        current_sequence_index: 0,
        last_eaten_time: 0,
    },
    cur_game_countdown: null,
    visited: {},
};
//read previous history
db.history = JSON.parse(fs.readFileSync("./data/history.json", "utf-8"));

function endgame(socket) {
    //console.log("game_ended");
    clearInterval(db.cur_game_countdown);
    console.log("game ended");
    console.log(
        `Team ${db.current_team} got ${db.status.point} points at game${db.status.gamemode}.`
    );
    if (
        !db.history[db.status.gamemode][db.current_team] ||
        db.history[db.status.gamemode][db.current_team].point <
            db.status.point ||
        (db.history[db.status.gamemode][db.current_team].point ==
            db.status.point &&
            db.history[db.status.gamemode][db.current_team].last_eaten_time <
                db.status.point)
    ) {
        db.history[db.status.gamemode][db.current_team] = {
            point: db.status.point,
            last_eaten_time: db.status.last_eaten_time,
            time: new Date().toString().slice(0, 24),
        };
    }
    socket.broadcast.emit("game_end", {
        history: db.history[db.status.gamemode],
        gamemode: db.status.gamemode,
    });
    socket.emit("game_end");
    //reset db status
    //console.log(db);
    db.current_team = null;
    db.cur_game_countdown = null;
    db.last_eaten_time = 0;
    db.time_remaining = GAME_TIME;
    db.status.gamemode = null;
    db.status.point = 0;
    db.status.current_sequence_index = 0;
    db.status.last_eaten_time = GAME_TIME;
    db.visited = {};
    //write previous history to file
    fs.writeFile("./data/history.json", JSON.stringify(db.history), (err) => {
        if (err) {
            console.log("history write error");
        } else {
            console.log("history filewrite complete");
        }
    });
}

// socket.io server
io.on("connection", (socket) => {
    console.log("connected");
    console.log("Connect time:", new Date().toString().slice(0, 24));
    socket.on("add_UID", (data) => {
        //io.emit("update_score");
        //socket.emit("invalid_uid")
        //record the time getting uid
	console.log("UID:",data.uid_str);
	//convert to upper case
	data.uid_str = data.uid_str.toUpperCase();
        if (db.status.gamemode == 0) {
            if (!uids[data.uid_str]) {
                socket.emit("UID_added", "uid not found.");
            } else if (db.visited[data.uid_str]) {
                socket.emit("UID_added", "uid already visited.");
            } else {
                db.status.point += uids[data.uid_str];
                db.status.last_eaten_time = db.time_remaining;
                db.visited[data.uid_str] = true;
                socket.emit(
                    "UID_added",
                    `Added ${uids[data.uid_str]} points at ${
                        db.time_remaining
                    } seconds left.`
                );
                socket.broadcast.emit("UID_added", { point: db.status.point });
                console.log(
                    `Added ${uids[data.uid_str]} points at ${
                        db.time_remaining
                    } seconds left.`
                );
            }
        } else if (db.status.gamemode == 1) {
            if (sequence[db.status.current_sequence_index] == data.uid_str) {
                db.status.point += 100;
                db.status.current_sequence_index++;
                db.status.last_eaten_time = db.time_remaining;
                socket.emit("UID_added", `100 points added`);
                socket.broadcast.emit("UID_added", { point: db.status.point });
            } else {
                socket.emit(
                    "UID_added",
                    `UID ${data.uid_str} not in correct order of sequence`
                );
                console.log(
                    `UID ${data.uid_str} not in correct order of sequence`
                );
            }
        }
        //console.log(db);
    });
    socket.on("start_game", (data) => {
        //console.log(data.gamemode)
        if (data.gamemode != 0 && data.gamemode != 1) {
            socket.emit("invalid_mode");
            return;
        }
        if (!db.cur_game_countdown && !db.current_team) {
            db.status.gamemode = data.gamemode;
            db.current_team = data.team;
            io.emit("game_started", {
                current_team: db.current_team,
                gamemode: db.status.gamemode,
            });
            console.log("start game");
            console.log("Start time:", new Date().toString().slice(0, 24));
            console.log("Current team:", data.team);
            console.log("Game mode:", data.gamemode);
            db.cur_game_countdown = setInterval(() => {
                if (db.time_remaining > 0) {
                    db.time_remaining = db.time_remaining - 1;
                    if (db.time_remaining % 10 === 0) {
                        socket.broadcast.emit("update_time", {
                            time_remain: db.time_remaining,
                        });
                    }
                } else {
                    endgame(socket);
                }
            }, 1000);
        } else {
            socket.emit("game_already_started", {
                time_remain: db.time_remaining,
            });
        }
    });
    socket.on("stop_game", () => {
        endgame(socket);
    });
});

nextApp.prepare().then(() => {
    app.get("/remain_time", (req, res) => {
        res.json({ time_remain: db.time_remaining });
    });
    app.get("/current_score", (req, res) => {
        res.json({ current_score: db.status.point });
    });
    //for python client
    app.get("/game_status", (req, res) => {
        res.json({
            current_team: db.current_team,
            time_remain: db.time_remaining,
        });
    });
    //for nextjs client
    app.get("/game_info", (req, res) => {
        res.json({
            history: db.history,
            current_team: db.current_team,
            time_remaining: db.time_remaining,
            status: db.status,
            GAME_TIME: GAME_TIME,
        });
    });
    app.get("/reset", (req,res) => {
	if(req.query.pass === "taonly"){
		fs.writeFile("./data/history.json",JSON.stringify({"0":{},"1":{}}),(err)=>{
			if(!err){
				console.log("reset_complete");
				res.json({message: "reset_complete"});
			}
			else{
				console.log(err);
				res.json({error: "reset_error"});
			}
		});
		db.history = {"0":{},"1":{}};
	}
    });

    app.get("*", (req, res) => {
        return nextHandler(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log("> Ready on http://localhost:3000");
    });
});
