import SignalingClient from "./signalingClient";

class Client {
  constructor(appid, appcert) {
    this.signal = new SignalingClient(appid, appcert);
  }

  init(account, token = "_no_need_token", channelId) {
    return this.signal
      .login(account, token)
      .then(() => this.signal.join(channelId));
  }
}

export class PlayerClient extends Client {
  constructor(appid, appcert) {
    super(appid, appcert);
  }

  broadcast(msg) {
    this.signal.broadcastMessage(JSON.stringify(msg));
  }

  send(account, msg) {
    this.signal.sendMessage(account, JSON.stringify(msg));
  }
}

export class GuessClient extends Client {
  constructor(appid, appcert) {
    super(appid, appcert);
  }
}
