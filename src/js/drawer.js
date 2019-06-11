import { getSize } from "./util";

export default class Drawer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.rect = canvas.getBoundingClientRect();
    this.strokeStyle = "#000";
    this.lineWidth = 1;
  }

  init() {
    const rate = this.getPixelRatio();
    const canvas = this.canvas;
    const ctx = this.ctx;
    const width = canvas.width;
    const height = canvas.height;
    if (rate > 1) {
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.height = height * rate;
      canvas.width = width * rate;
      ctx.scale(rate, rate);
    }
    this.ctx.imageSmoothingEnabled = true;
  }

  reset(width, height) {
    const rate = this.getPixelRatio();
    const canvas = this.canvas;
    const ctx = this.ctx;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    canvas.height = height * rate;
    canvas.width = width * rate;
    ctx.scale(rate, rate);
  }

  getPixelRatio() {
    const ctx = this.ctx;
    const backingStore =
      ctx.backingStorePixelRatio ||
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;
    return (window.devicePixelRatio || 1) / backingStore;
  }

  setContexts(kv) {
    for (let p in kv) {
      this.setContext(p, kv[p]);
    }
  }

  setContext(property, value) {
    if (property in this.ctx) {
      this.ctx[property] = value;
    }
  }

  getColor() {
    return this.strokeStyle;
  }

  setColor(color) {
    this.strokeStyle = color;
    this.ctx.shadowColor = color;
  }

  getLineWith() {
    return this.lineWidth;
  }

  setLineWith(width) {
    this.lineWidth = width;
  }

  clear(point) {
    const { ctx } = this;
    const wh = this.getWH();

    if (!point) {
      this.ctx.clearRect(0, 0, wh.width, wh.height);
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.arc(point.x, point.y, this.lineWidth, 0, Math.PI * 2, false);
      ctx.clip();
      ctx.clearRect(0, 0, wh.width, wh.height);
      ctx.restore();
    }
  }

  getWH() {
    return {
      height: this.canvas.height,
      width: this.canvas.width
    };
  }

  getCSSWH() {
    return getSize(this.canvas);
  }

  drawStart(point) {
    const { ctx } = this;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(point.x, point.y);
    ctx.stroke(); //画一个点
  }

  drawMove(point) {
    let ctx = this.ctx;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  arcTo(point1, point2, radius) {
    let ctx = this.ctx;
    ctx.arcTo(point1.x, point1.y, point2.x, point2.y, radius);
    ctx.stroke();
  }

  toDataURL(type, quality) {
    return this.canvas.toDataURL(type || "image/png", quality | 0.75);
  }

  drawImage(img, x, y, width, height, dx, dy, dWidth, dHeight) {
    if (dx == null && dWidth == null) {
      this.ctx.drawImage(
        img,
        x,
        y,
        width | this.canvas.width,
        height | this.canvas.height
      );
      return;
    }
    this.ctx.drawImage(img, x, y, width, height, dx, dy, dWidth, dHeight);
  }

  quadraticCurveTo(cpx, cpy, x, y) {
    let ctx = this.ctx;
    ctx.quadraticCurveTo(cpx, cpy, x, y);
    ctx.stroke();
  }
}
