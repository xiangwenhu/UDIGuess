import Drawer from "./drawer";
import { getEventPoint, eventsName } from "./util";
import browser from "./browser";
import LSStore from "./lsStore";
import EventEmitter from "./lib/EventEmitter";

export default class PlayerDrawer extends Drawer {
  constructor(canvas, emitter) {
    super(canvas);
    this.emitter = emitter || new EventEmitter();
    // 1:绘制 2:擦除
    this._mode = 1;
    this.isDrawing = false;
    this.bgColor = "#FFF";
    this.lineColor = "#000";
    this.points = [];
    this.ls = new LSStore();
    this.init();
  }

  init() {
    super.init();
    this.registerEvents();
    this.restore();
    this.ls.start(this.backUp.bind(this));
  }

  restore() {
    const imgBase64 = this.ls.getData();
    if (imgBase64) {
      const img = new window.Image();
      img.src = imgBase64;
      img.style = "display:none";
      document.body.appendChild(img);
      const size = this.getCSSWH();
      const that = this;
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
  }

  backUp() {
    return this.toDataURL("image/webp", 0.92);
  }

  get mode() {
    return this._mode;
  }

  set mode(value) {
    this._mode = value;
    if (value === 2) {
      this.setContext("globalCompositeOperation", "destination-out");
      return;
    }
    this.setContext("globalCompositeOperation", "source-over");
  }

  registerEvents() {
    const { canvas } = this;
    canvas[`on${eventsName.mousedown}`] = this.onMouseDown.bind(this);
    canvas[`on${eventsName.mouseup}`] = this.onMouseUp.bind(this);
    canvas[`on${eventsName.mousemove}`] = this.onMouseMove.bind(this);
    canvas[`on${eventsName.mouseleave}`] = this.onMouseLeave.bind(this);

    document.addEventListener(eventsName.mouseup, () => {
      if (this.isDrawing) {
        this.isDrawing = false;
      }
    });

    const rate = super.getPixelRatio();
    if (browser.isPC) {
      this.setContexts({
        shadowColor: "#000",
        shadowBlur: rate,
        shadowOffsetX: 0,
        shadowOffsetY: 1
      });
    }
  }

  onMouseDown(ev) {
    const point = getEventPoint(ev, this.rect);
    if (this._mode === 1) {
      this.isDrawing = true;
      this.drawStart(point);
    } else {
      this.isDrawing = false;
      this.drawStart(point);
      //super.clear(point);
    }
    this.points.push(point);
    this.dispatch("mousedown", { point });
    ev.preventDefault();
  }

  onMouseUp(ev) {
    this.isDrawing = false;
    //this.drawCurve();
    //this.points = [];
    this.dispatch("mouseup");
  }

  onMouseMove(ev) {
    const point = getEventPoint(ev, this.rect);
    if (this._mode === 1 && this.isDrawing) {
      super.drawMove(point);
      this.dispatch("mousemove", { point });
    } else if (this._mode === 2) {
      // super.clear(point);
      super.drawMove(point);
      this.dispatch("mousemove", { point });
    }
    this.points.push(point);
    ev.preventDefault();
  }

  onMouseLeave(ev) {
    //this.isDrawing = false;
  }

  on(type, fn) {
    if (this.emitter) {
      this.emitter.on(type, fn);
    }
  }

  dispatch(type, data, ...args) {
    if (this.emitter) {
      if (typeof data === "object") {
        const d = Object.assign({}, data, {
          width: this.canvas.width,
          mode: this.mode
        });
        this.emitter.emit(type, d, ...args);
        return;
      }
      this.emitter.emit(type, data, ...args);
    }
  }

  drawCurve() {
    let points = this.points,
      ctx = this.ctx;

    ctx.moveTo(points[0].x, points[0].y);
    // eslint-disable-next-line no-var
    for (var i = 1; i < points.length - 2; i++) {
      let xc = (points[i].x + points[i + 1].x) / 2,
        yc = (points[i].y + points[i + 1].y) / 2;
      super.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    super.quadraticCurveTo(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y
    );
  }

  clear(point) {
    super.clear(point);
    this.ls.clear();
    this.dispatch("clear", { point });
  }

  set color(value) {
    super.setColor(value);
    this.dispatch("setColor", value);
  }

  set width(value) {
    super.setLineWith(value);
    this.dispatch("setLineWith", value);
  }
}
