import { getMouseEventName } from "./js/util";
import PlayerDrawer from "./js/playerDrawer";
import { PlayerClient } from "./js/client";

const canvasCol = document.querySelectorAll(".board");
// 固定比例  95 ： 50
const width = document.documentElement.clientWidth * 0.95;
const height = ~~(document.documentElement.clientWidth * 0.5);

Array.from(canvasCol).forEach(function(c) {
  c.height = height;
  c.width = width;
});

const playerDrawer = new PlayerDrawer(canvasCol[0]);

// 字体大小
document.getElementById("widthRange").addEventListener("change", function(ev) {
  playerDrawer.width = +ev.target.value;
});
// 橡皮擦
document
  .getElementById("btnEraser")
  .addEventListener(getMouseEventName("click"), function(ev) {
    const el = ev.target;
    if (playerDrawer.mode === 1) {
      playerDrawer.mode = 2;
      el.style.backgroundColor = "lightcoral";
    } else {
      playerDrawer.mode = 1;
      el.style.backgroundColor = "";
    }
  });
// 清屏
document
  .getElementById("btnClear")
  .addEventListener(getMouseEventName("click"), function(ev) {
    playerDrawer.clear();
  });

const jsColorEl = document.querySelector(".jscolor");
window.jsColorEl = jsColorEl;

// 颜色选择
jsColorEl.addEventListener(
  "change",
  function(ev) {
    playerDrawer.color = ev.target.style.backgroundColor;
  },
  false
);

const appid = "2b0eaef9a27f4e33909c9647219586dc";

let playerClient = new PlayerClient(appid, undefined);
playerClient.signal.channelEmitter.on("onChannelUserJoined", function(account) {
  let cssWH = playerDrawer.getCSSWH();
  // 画笔大小，颜色等传递
  sendMessage(account, {
    type: "onJoin",
    data: {
      pixelRatio: playerDrawer.getPixelRatio(),
      width: cssWH.width,
      height: cssWH.height,
      color: playerDrawer.getColor(),
      lineWidth: playerDrawer.getLineWith()
    }
  });

  const imgBase64 = playerDrawer.toDataURL("image/webp", 1);
  const arrStr = strToArray(imgBase64);
  const id = Date.now();

  arrStr.forEach(function(str, index) {
    sendMessage(account, {
      type: "onMirror",
      data: {
        id,
        length: arrStr.length,
        url: arrStr[index],
        index
      }
    });
  });
});

function strToArray(str, unitLength = 8000) {
  let len = Math.ceil(str.length / unitLength),
    ret = [];
  for (let i = 0; i < len; i++) {
    ret.push(str.slice(i * unitLength, (i + 1) * unitLength));
  }
  return ret;
}

function broadcastMessage(type) {
  return function(data) {
    playerClient.broadcast({ type, data: JSON.stringify(data) });
  };
}

function sendMessage(account, data) {
  playerClient.send(account, data);
}

playerClient
  .init(11111111, undefined, 77777777)
  .then(function() {
    playerDrawer.on("mousedown", broadcastMessage("mousedown"));
    playerDrawer.on("mousemove", broadcastMessage("mousemove"));
    playerDrawer.on("setColor", broadcastMessage("setColor"));
    playerDrawer.on("setLineWith", broadcastMessage("setLineWith"));
    playerDrawer.on("clear", broadcastMessage("clear"));
  })
  .catch(err => alert(err));
