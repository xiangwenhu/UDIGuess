const slice = Array.prototype.slice;

function Timeout(interval, context) {
  this.context = context || undefined;
  this.ticketId = null;
  this.interval = interval;
  this.callback = null;
}
Timeout.prototype.cancel = function() {
  this._isTiming = false;
  this.interval && clearTimeout(this.ticketId);
};

Timeout.prototype.innerStart = function() {
  const that = this;
  const next = function() {
    that.next(function() {
      this._isTiming = false;
      that.excute.apply(that, [next.bind(that)]);
    });
  };
  next.apply(this);
};

Timeout.prototype.excute = function() {
  if (!this.hasCallback()) {
    this.cancel();
    return;
  }
  const params = slice.call(arguments);
  this.callback.apply(this.context, params);
};

Timeout.prototype.next = function(cb) {
  this._isTiming = true;
  this.ticketId = setTimeout(cb, this.interval);
};

Timeout.prototype.setCallback = function(callback) {
  if (typeof callback !== "function" && callback !== null) {
    throw new Error("callback should be a function");
  }
  this.callback = callback;
};

Timeout.prototype.hasCallback = function() {
  return typeof this.callback === "function";
};

function timeout(interval, context) {
  const instance = new Timeout(interval, context);
  return {
    start(callback) {
      instance.cancel();
      instance.setCallback(null);
      if (typeof callback !== "function") {
        throw new Error("callback should be a function");
      }
      instance.setCallback(callback);
      instance.innerStart.apply(instance);
    },
    cancel: instance.cancel.bind(instance),
    continue() {
      if (instance.hasCallback() && !instance._isTiming) {
        instance.innerStart.apply(instance);
      }
    },
    setInterval(interval) {
      instance.cancel();
      instance.interval = interval;
      instance.innerStart.apply(instance);
    },
    setContext(context) {
      instance.context = context;
    }
  };
}

export default timeout;
