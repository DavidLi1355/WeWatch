// setup client side socket io
const socket = io("/");
socket.emit("join-room", ROOM_ID);

socket.on("get-status", (data) => {
    console.log("in get-status");
    var url = player.getVideoUrl();
    console.log(url);
    var videoID = url.split("v=")[1];
    var ampersandPosition = videoID.indexOf("&");
    if (ampersandPosition != -1) {
        videoID = videoID.substring(0, ampersandPosition);
    }

    data["videoID"] = videoID;
    data["videoState"] = player.getPlayerState();
    data["videoTime"] = player.getCurrentTime();

    console.log(data);
    socket.emit("send-current-status", data);
});

socket.on("set-status", (data) => {
    console.log("set-status");
    player.cueVideoById(data.videoID);
    if (data.videoState === 1) {
        player.playVideo();
        player.seekTo(data.time, true);
    } else if (data.videoState === 2) {
        player.pauseVideo();
    }
});

socket.on("video-played", (data) => {
    console.log("video-played");
    if (player.getPlayerState() !== 1) {
        player.playVideo();
        player.seekTo(data.time, true);
    }
});

socket.on("video-paused", () => {
    console.log("video-paused");
    player.pauseVideo();
});

socket.on("video-changed", (data) => {
    player.cueVideoById(data.videoID);
});

// setup YouTube player and YouTube player functions
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
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

function onPlayerReady(event) {
    console.log("Player ready");
}

function onPlayerStateChange(event) {
    console.log(event.data);
    if (event.data === 1) {
        socket.emit("play-video", {
            roomID: ROOM_ID,
            time: player.getCurrentTime(),
        });
    } else if (event.data === 2) {
        socket.emit("pause-video", {
            roomID: ROOM_ID,
        });
    }
}

function changeVideo(videoID) {
    console.log("Change video");
    player.cueVideoById(videoID);
    console.log(videoID);
    socket.emit("change-video", {
        roomID: ROOM_ID,
        videoID: videoID,
    });
}
