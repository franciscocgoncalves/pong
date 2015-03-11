// Generated by CoffeeScript 1.9.1
var Object;

Object = (function() {
  function Object(el, gm) {
    this.el = el;
    this.gm = gm;
    this.restart();
  }

  Object.prototype.color = function(color) {
    if (color != null) {
      return this.el.css("background-color", color);
    } else {
      return this.el.css("background-color");
    }
  };

  Object.prototype.x = function(x) {
    if (x != null) {
      this.el.css("left", x + "px");
    }
    return parseFloat(this.el.css("left"));
  };

  Object.prototype.y = function(y) {
    if (y != null) {
      this.el.css("bottom", y + "px");
    }
    return parseFloat(this.el.css("bottom"));
  };

  Object.prototype.move = function(speed) {
    var finalX, finalY;
    speed = speed || this.speed || {
      x: 0,
      y: 0
    };
    finalY = this.y() + speed.y * this.delta / 1000;
    finalX = this.x() + speed.x * this.delta / 1000;
    if (finalY < 0) {
      this.y(0);
      this.collisionY();
    } else if (finalY + this.height() > pongScreen.height) {
      this.y(pongScreen.height - this.height());
      this.collisionY();
    } else {
      this.y(finalY);
    }
    if (finalX < 0) {
      this.x(0);
      return this.collisionX(this.gm.leftPlayer);
    } else if (finalX + this.width() > pongScreen.width) {
      this.x(pongScreen.width - this.width());
      return this.collisionX(this.gm.rightPlayer);
    } else {
      return this.x(finalX);
    }
  };

  Object.prototype.update = function() {
    if (this.updated == null) {
      this.updated = Date.now();
      return;
    }
    this.delta = Date.now() - this.updated;
    if (!this.gm.paused) {
      this._update();
    }
    return this.updated = this.updated + this.delta;
  };

  Object.prototype._update = function() {};

  Object.prototype.width = function() {
    return this.el.width();
  };

  Object.prototype.height = function() {
    return this.el.height();
  };

  Object.prototype.left = function() {
    return this.x();
  };

  Object.prototype.right = function() {
    return this.x() + this.width();
  };

  Object.prototype.up = function() {
    return this.y() + this.height();
  };

  Object.prototype.down = function() {
    return this.y();
  };

  Object.prototype.checkCollision = function(o) {
    if (o.left() > this.right() || o.right() < this.left() || o.down() > this.up() || o.up() < this.down()) {
      return false;
    }
    return true;
  };

  Object.prototype.collisionX = function() {};

  Object.prototype.collisionY = function() {};

  Object.prototype.restart = function() {
    this.restartX();
    return this.restartY();
  };

  Object.prototype.restartX = function() {
    return this.x(pongScreen.width / 2 - this.width() / 2);
  };

  Object.prototype.restartY = function() {
    return this.y(pongScreen.height / 2 - this.height() / 2);
  };

  return Object;

})();
