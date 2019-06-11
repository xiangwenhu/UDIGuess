import GuessDrawer from "./js/guessDrawer";
import { GuessClient } from "./js/client";
import EventEmitter from "./js/lib/EventEmitter";
import getSize from "./js/getSize";
import DataCheckCenter from "./js/DataCheckCenter";

const size = getSize();
const canvasCol = document.querySelectorAll("canvas");

Array.from(canvasCol).forEach(function(c, index) {
  c.height = size.height;
  c.width = size.width;
});

const canvas = document.querySelector(".board");
const appid = "2b0eaef9a27f4e33909c9647219586dc";

const dck = new DataCheckCenter();

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
          dck.set(id, index, length, url);
          if (dck.isOk(id)) {
            emitter.emit(data.type, dck.get(id).join(""));
            dck.remove(id);
          }
          break;

        case "onJoin":
          emitter.emit(data.type, data.data);
          break;
      }    
    });

    new GuessDrawer(canvas, emitter);
  })
  .catch(err => alert(err));
