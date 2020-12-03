const express = require("express");
const { Socket } = require("socket.io");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("main");
});

app.get("/api/create", (req, res) => {
    console.log("hi");
    res.json({ roomID: `/${uuidV4()}` });
});

app.get("/:roomID", (req, res) => {
    res.render("room", { roomID: req.params.roomID });
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomID) => {
        console.log("client connected");
        socket.join(roomID);
    });

    socket.on("play-video", (data) => {
        socket
            .to(data.roomID)
            .broadcast.emit("video-played", { time: data.time });
    });

    socket.on("pause-video", (data) => {
        socket.to(data.roomID).broadcast.emit("video-paused");
    });

    socket.on("change-video", (data) => {});
});

server.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
