import browser from "./browser";

const eventsMap = {
  mousedown: "touchstart",
  mousemove: "touchmove",
  mouseup: "touchend",
  mouseenter: "touchenter",
  mouseleave: "touchleave",
  click: "touchstart"
};

const browserInfo = browser();
const isPc = browserInfo.isPc;

export function getMouseEventName(name) {
  if (isPc) {
    return name;
  }
  return eventsMap[name];
}

export const eventsName = {
  mousedown: getMouseEventName("mousedown"),
  mouseup: getMouseEventName("mouseup"),
  mousemove: getMouseEventName("mousemove"),
  mouseleave: getMouseEventName("mouseleave")
};

export function getEventPoint(ev, rect) {
  if (isPc) {
    return { x: ev.offsetX, y: ev.offsetY };
  }
  const el = ev.target;
  const touch = ev.touches[0];

  let offset = rect;

  if (!rect) {
    offset = getOffset(el);
  } else {
    const docElement = el.ownerDocument.documentElement;
    offset = {
      top: offset.top + window.pageYOffset - docElement.clientTop,
      left: offset.left + window.pageXOffset - docElement.clientLeft
    };
  }
  return {
    x: touch.clientX - offset.left,
    y: touch.clientY - offset.top
  };
}

export function getOffset(node) {
  let offset = {
    top: 0,
    left: 0
  };
  // 当前为IE11以下, 直接返回{top: 0, left: 0}
  if (!node.getClientRects().length) {
    return offset;
  }
  // 当前DOM节点的 display === 'node' 时, 直接返回{top: 0, left: 0}
  if (window.getComputedStyle(node)["display"] === "none") {
    return offset;
  }
  // Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。
  // 返回值包含了一组用于描述边框的只读属性——left、top、right和bottom，单位为像素。除了 width 和 height 外的属性都是相对于视口的左上角位置而言的。
  // 返回如{top: 8, right: 1432, bottom: 548, left: 8, width: 1424…}
  offset = node.getBoundingClientRect();
  const docElement = node.ownerDocument.documentElement;
  return {
    top: offset.top + window.pageYOffset - docElement.clientTop,
    left: offset.left + window.pageXOffset - docElement.clientLeft
  };
}

export function getSize(el) {
  let ps = window.getComputedStyle(el);
  return {
    height: pxToNumer(ps.height),
    width: pxToNumer(ps.width)
  };
}

function pxToNumer(str) {
  return +str.replace("px", "");
}
