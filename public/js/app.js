// Generated by CoffeeScript 1.9.1
var Ball, Object, Player, events, keyCodes, leftPlayer, objects, paused, pongScreen, ready, rightPlayer, scores,
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
      return this.collisionX(leftPlayer);
    } else if (finalX + this.width() > pongScreen.width) {
      this.x(pongScreen.width - this.width());
      return this.collisionX(rightPlayer);
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
    if (!events[keyCodes.p]) {
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

  Object.prototype.collisionX = function(p) {};

  Object.prototype.collisionY = function() {};

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
      y: 400
    });
  };

  Player.prototype.moveDown = function() {
    return this.move({
      x: 0,
      y: -400
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

Ball = (function(superClass) {
  extend(Ball, superClass);

  function Ball(el, speed1) {
    this.el = el;
    this.speed = speed1;
    Ball.__super__.constructor.call(this, this.el);
    this.y(pongScreen.height / 2);
    this.x(pongScreen.width / 2);
  }

  Ball.prototype._update = function() {
    var collision, i, len, object;
    collision = false;
    for (i = 0, len = objects.length; i < len; i++) {
      object = objects[i];
      if (!(!collision && !(object instanceof Ball) && this.checkCollision(object))) {
        continue;
      }
      this.speed.x *= -1;
      collision = true;
    }
    return this.move();
  };

  Ball.prototype.collisionX = function(p) {
    this.speed.x = -this.speed.x;
    if (p === leftPlayer) {
      scores[rightPlayer]++;
      return this.restart();
    } else if (p === rightPlayer) {
      scores[leftPlayer]++;
      return this.restart();
    }
  };

  Ball.prototype.collisionY = function() {
    return this.speed.y = -this.speed.y;
  };

  Ball.prototype.restart = function() {
    $("#score").text(scores[0] + " - " + scores[1]);
    this.y(pongScreen.height / 2);
    return this.x(pongScreen.width / 2);
  };

  return Ball;

})(Object);

keyCodes = {
  w: 87,
  s: 83,
  p: 80
};

events = {
  other: {}
};

pongScreen = {
  width: 854,
  height: 480
};

leftPlayer = 0;

rightPlayer = 1;

scores = [0, 0];

objects = null;

ready = paused = false;

$(function() {
  var pausedText, scoreText, socket;
  pausedText = $("#paused");
  pausedText.css("left", pongScreen.width / 2 - pausedText.width() / 2);
  scoreText = $("#score");
  scoreText.text(scores[0] + " - " + scores[1]);
  scoreText.css("left", pongScreen.width / 2 - scoreText.width() / 2);
  objects = [
    new Player($("#player1"), true), new Player($("#player2")), new Ball($(".ball"), {
      x: 200,
      y: -200
    })
  ];
  setInterval(function() {
    var i, len, object, results;
    if (ready && !paused) {
      results = [];
      for (i = 0, len = objects.length; i < len; i++) {
        object = objects[i];
        results.push(object.update());
      }
      return results;
    }
  }, 100 / 6);
  socket = io(location.origin);
  socket.on("start", function(speed) {
    var i, len, object;
    for (i = 0, len = objects.length; i < len; i++) {
      object = objects[i];
      if (object instanceof Ball) {
        object.speed = speed;
      }
    }
    return ready = true;
  });
  socket.on("stop", function() {
    return ready = false;
  });
  socket.on("keydown", function(keyCode) {
    events.other[keyCode] = true;
    console.log("him: down:", keyCode, Date.now());
    if (keyCode === keyCodes.p) {
      paused = !paused;
      return $("#paused").toggle();
    }
  });
  socket.on("keyup", function(keyCode) {
    events.other[keyCode] = false;
    return console.log("him: up:", keyCode, Date.now());
  });
  $(document).on("keydown", function(event) {
    if (!events[event.keyCode]) {
      events[event.keyCode] = !events[event.keyCode];
      socket.emit("keydown", event.keyCode);
      console.log("me: down:", event.keyCode, Date.now());
      if (event.keyCode === keyCodes.p) {
        paused = !paused;
        return $("#paused").toggle();
      }
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
