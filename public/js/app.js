// Generated by CoffeeScript 1.9.1
var Ball, Object, Player, events, keyCodes, pongScreen,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object = (function() {
  function Object(el) {
    this.el = el;
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
      this.el.css("left", x);
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
    var finalY;
    speed = speed || this.speed || {
      x: 0,
      y: 0
    };
    finalY = this.y() + speed.y * this.delta / 1000;
    if (finalY < 0) {
      return this.y(0);
    } else if (finalY + this.height() > pongScreen.height) {
      return this.y(pongScreen.height - this.height());
    } else {
      return this.y(finalY);
    }
  };

  Object.prototype.update = function() {
    if (this.updated == null) {
      this.updated = Date.now();
      return;
    }
    this.delta = Date.now() - this.updated;
    this._update();
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

  Object.prototype.checkColision = function(o) {
    if ((o.left() >= this.left() && o.left() <= this.right() || o.right() <= this.right() && o.right() >= this.left()) && (o.up() <= this.up() && o.up() >= this.down() || o.down() >= this.down() && o.down() <= this.up())) {
      return true;
    }
    return false;
  };

  return Object;

})();

Player = (function(superClass) {
  extend(Player, superClass);

  function Player(el, self) {
    this.el = el;
    this.self = self;
    Player.__super__.constructor.call(this, this.el);
    this.y(pongScreen.height / 2 - this.height() / 2);
    if (this.self != null) {
      this.x(20);
      this.color("green");
    } else {
      this.x(pongScreen.width - this.width() - 20);
      this.color("red");
    }
  }

  Player.prototype.moveUp = function() {
    return this.move({
      x: 0,
      y: 200
    });
  };

  Player.prototype.moveDown = function() {
    return this.move({
      x: 0,
      y: -200
    });
  };

  Player.prototype._update = function() {
    if (this.self != null) {
      if (events[keyCodes.w]) {
        this.moveUp();
      }
      if (events[keyCodes.s]) {
        return this.moveDown();
      }
    } else {
      if (events.other[keyCodes.w]) {
        this.moveUp();
      }
      if (events.other[keyCodes.s]) {
        return this.moveDown();
      }
    }
  };

  return Player;

})(Object);

keyCodes = {
  w: 87,
  s: 83
};

events = {
  other: {}
};

pongScreen = {
  width: 854,
  height: 480
};

$(function() {
  var objects, socket;
  objects = [new Player($("#player1"), true), new Player($("#player2"))];
  setInterval(function() {
    var i, len, object, results;
    results = [];
    for (i = 0, len = objects.length; i < len; i++) {
      object = objects[i];
      results.push(object.update());
    }
    return results;
  }, 100 / 6);
  socket = io(location.origin);
  socket.on("keydown", function(keyCode) {
    events.other[keyCode] = true;
    return console.log("him: down:", keyCode, Date.now());
  });
  socket.on("keyup", function(keyCode) {
    events.other[keyCode] = false;
    return console.log("him: up:", keyCode, Date.now());
  });
  $(document).on("keydown", function(event) {
    if (!events[event.keyCode]) {
      events[event.keyCode] = true;
      socket.emit("keydown", event.keyCode);
      return console.log("me: down:", event.keyCode, Date.now());
    }
  });
  return $(document).on("keyup", function(event) {
    if (events[event.keyCode]) {
      events[event.keyCode] = false;
      socket.emit("keyup", event.keyCode);
      return console.log("me: up:", event.keyCode, Date.now());
    }
  });
});

Ball = (function(superClass) {
  extend(Ball, superClass);

  function Ball() {
    return Ball.__super__.constructor.apply(this, arguments);
  }

  return Ball;

})(Object);
