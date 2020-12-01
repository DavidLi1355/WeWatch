const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("main");
});

app.get("/:room", (req, res) => {
    res.render("main");
});

server.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
