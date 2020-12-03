// setup socket connection
// const socket = io.connect("http://localhost");
const socket = io("/");
socket.emit("join-room", ROOM_ID);

socket.on("video-played", (data) => {
    if (player.getPlayerState() !== 1) {
        player.playVideo();
        player.seekTo(data.time, true);
    }
});

socket.on("video-paused", () => {
    player.pauseVideo();
});

// setup YouTube player
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtubePlayer", {
        height: "720",
        width: "1280",
        videoId: "M7lc1UVf-VE",
        events: {
            onStateChange: onPlayerStateChange,
        },
    });
}

function onPlayerStateChange(event) {
    if (player.getPlayerState() === 1) {
        console.log("Started");
        sendAction("play-video", {
            roomID: ROOM_ID,
            time: player.getCurrentTime(),
        });
    } else if (player.getPlayerState() === 2) {
        console.log("Paused");
        sendAction("pause-video", {
            roomID: ROOM_ID,
        });
    }
}

function changeVideo(event) {
    event.preventDefault();
    console.log("Change video");
    videoID = "Hk0ABoBaN4c";
    player.loadVideoById(videoID);
    sendAction("change-video", videoID);
}

function sendAction(action, data) {
    socket.emit(action, data);
}
