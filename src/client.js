// 固定比例  95 ： 40
const width = document.documentElement.clientWidth * 0.95;
const height = ~~(document.documentElement.clientWidth * 0.5);
const canvasCol = document.querySelectorAll("canvas");

Array.from(canvasCol).forEach(function(c, index) {
  c.height = height;
  c.width = width;
});

import GuessDrawer from "./js/guessDrawer";
import { GuessClient } from "./js/client";
import EventEmitter from "./js/lib/EventEmitter";

const canvas = document.querySelector(".board");
const appid = "2b0eaef9a27f4e33909c9647219586dc";

class DataCenter {
  constructor() {
    this.data = Object.create(null);
  }

  set(id, index, length, data) {
    if (!this.data[id]) {
      const arr = new Array(length);
      arr.fill(null, 0);
      this.data[id] = arr;
    }
    let d = this.data[id];
    d[index] = data;
  }

  isOk(id) {
    const arr = this.data[id];
    if (!arr) {
      return false;
    }
    if (!Array.isArray(arr)) {
      return false;
    }
    return this.data[id].every(function(d) {
      return !!d;
    });
  }

  get(id) {
    return this.data[id];
  }
}

const dataCenter = new DataCenter();

const guessClient = new GuessClient(appid, undefined);
guessClient
  .init(22222222, undefined, 77777777)
  .then(function() {
    const emitter = new EventEmitter();

    guessClient.signal.channelEmitter.on("onMessageChannelReceive", function(
      account,
      uid,
      msg
    ) {
      if (account !== guessClient.signal.account) {
        const data = JSON.parse(msg);
        emitter.emit(data.type, JSON.parse(data.data));
      }
    });

    guessClient.signal.sessionEmitter.on("onMessageInstantReceive", function(
      account,
      uid,
      msg
    ) {
      const data = JSON.parse(msg);
      const { id, length, url, index } = data.data;

      switch (data.type) {
        case "onMirror":
          if (index === 0) {
            console.time("timing");
          }
          if (index === length - 1) {
            console.timeEnd("timing");
          }

          // 拼接图片
          dataCenter.set(id, index, length, url);
          if (dataCenter.isOk(id)) {
            emitter.emit(data.type, dataCenter.get(id).join(""));
          }
          break;

        case "onJoin":
          emitter.emit(data.type, data.data);
          break;
      }

      //emitter.emit(data.type, data.data.url);
    });

    new GuessDrawer(canvas, emitter);
  })
  .catch(err => alert(err));
