const express = require("express");
const { stat } = require("fs");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

// main page view
app.get("/", (req, res) => {
    res.render("main");
});

// api to create room
app.get("/api/create", (req, res) => {
    res.json({ roomID: `/${uuidV4()}` });
});

// room view
app.get("/:roomID", (req, res) => {
    res.render("room", { roomID: req.params.roomID });
});

// socket io
io.on("connection", (socket) => {
    socket.on("join-room", async (roomID) => {
        await socket.join(roomID);
        console.log("client connected");
        console.log(io.sockets.adapter.rooms.get(roomID));
        var users = io.sockets.adapter.rooms.get(roomID);
        if (typeof users.size > 1) {
            var firstSocketID = users.values().next().value;
            console.log("first socket id: " + firstSocketID);
            console.log("current socket id: " + socket.id);
            socket
                .to(firstSocketID)
                .emit("get-status", { socketID: socket.id });
        }
    });

    socket.on("send-current-status", (data) => {
        console.log("send-current-status");
        console.log(data);
        socket.to(data.socketID).emit("set-status", data);
    });

    socket.on("play-video", (data) => {
        console.log("server play-video");
        console.log(data);
        console.log(io.sockets.adapter.rooms);
        socket.to(data.roomID).emit("video-played", { time: data.time });
    });

    socket.on("pause-video", (data) => {
        socket.to(data.roomID).emit("video-paused");
    });

    socket.on("change-video", (data) => {
        console.log("change-video: ");
        console.log(data);
        socket.to(data.roomID).emit("video-changed", { videoID: data.videoID });
    });
});

server.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
