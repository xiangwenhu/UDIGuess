export default class DataCheckCenter {
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

  remove(id) {
    delete this.data[id];
  }
}
