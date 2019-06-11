import timeout from "./timeout";

export default class LSStore {
  constructor(interval = 1000, lsKey = "__UDIG__") {
    this.lsKey = lsKey;
    this.tins = timeout(interval);
  }

  start(cb) {
    if (!cb) {
      return;
    }

    const that = this;
    this.tins.start(function(next) {
      const data = cb();
      that.saveData(data);
      next();
    });
  }

  cancel() {
    this.tins.cancel();
  }

  saveData(data) {
    // TODO:: 替换为indexDB
    localStorage.setItem(this.lsKey, data);
  }

  getData() {
    return localStorage.getItem(this.lsKey);
  }

  clear() {
    return localStorage.removeItem(this.lsKey);
  }
}
