import Drawer from "./drawer";

export default class GuessDrawer extends Drawer {
  constructor(canvas, emitter) {
    super(canvas);
    this.emitter = emitter;
    this.init();
    this.playerOption = null;
    this.sizeRate = 1;
  }

  init() {
    super.init();
    this.registerEvents();
  }

  registerEvents() {
    if (!this.emitter) {
      return;
    }
    this.emitter.on("onJoin", this.onJoin.bind(this));
    this.emitter.on("onMirror", this.onMirror.bind(this));
    this.emitter.on("mousedown", this.onMouseDown.bind(this));
    this.emitter.on("mousemove", this.onMouseMove.bind(this));
    this.emitter.on("setColor", this.onSetColor.bind(this));
    this.emitter.on("setLineWith", this.onsetLineWith.bind(this));
    this.emitter.on("clear", this.onClear.bind(this));
  }

  onJoin(option) {
    this.playerOption = option;
    this.sizeRate = this.getCSSWH().width / option.width;

    this.setColor(option.color);
    this.setLineWith(option.lineWidth * this.sizeRate);
  }

  onMirror(imgbase64) {
    const that = this;
    const img = new window.Image();
    img.src = imgbase64;
    img.style = "display:none";
    document.body.appendChild(img);
    const size = this.getCSSWH();
    img.onload = function() {
      that.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        size.width,
        size.height
      );
      img.remove();
    };
  }

  onMouseDown({ point, mode, width }) {
    const p = this.getComputedPoint(point, width);
    if (mode === 1) {
      super.drawStart(p);
    } else {
      super.clear(p);
    }
  }

  onMouseMove({ point, mode, width }) {
    const p = this.getComputedPoint(point, width);
    if (mode === 1) {
      super.drawMove(p);
    } else {
      super.clear(p);
    }
  }

  onSetColor(color) {
    super.setColor(color);
  }

  onsetLineWith(width) {
    super.setLineWith(Math.max(1, width * this.sizeRate));
  }

  onClear({ point }) {
    super.clear(point);
  }

  getComputedPoint(point) {
    const sizeRate = this.sizeRate;
    return {
      x: point.x * sizeRate,
      y: point.y * sizeRate
    };
  }
}
