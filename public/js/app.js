// Generated by CoffeeScript 1.9.1
var Ball, Events, GameManager, Network, Object, Player, gameManager, pongScreen,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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

Player = (function(superClass) {
  extend(Player, superClass);

  function Player(el, self1, gm, events) {
    this.el = el;
    this.self = self1;
    this.gm = gm;
    this.events = events;
    this.defaultSpeed = {
      x: 0,
      y: 400
    };
    Player.__super__.constructor.call(this, this.el, this.gm);
    if (this.self != null) {
      this.x(20);
      this.color("green");
    } else {
      this.x(pongScreen.width - this.width() - 20);
      this.color("red");
    }
  }

  Player.prototype.moveUp = function() {
    this.currentSpeed.y = this.speed.y;
    return this.move(this.currentSpeed);
  };

  Player.prototype.moveDown = function() {
    this.currentSpeed.y = -this.speed.y;
    return this.move(this.currentSpeed);
  };

  Player.prototype._update = function() {
    if (this.self != null) {
      if (!this.events.events[this.events.keyCodes.w] && !this.events.events[this.events.keyCodes.s]) {
        return this.currentSpeed.y = 0;
      } else {
        if (this.events.selfMovingUp()) {
          this.moveUp();
        }
        if (this.events.selfMovingDown()) {
          return this.moveDown();
        }
      }
    } else {
      if (this.events.otherMovingUp()) {
        this.moveUp();
      }
      if (this.events.otherMovingDown()) {
        return this.moveDown();
      }
    }
  };

  Player.prototype.restart = function() {
    this.restartY();
    this.speed = {
      x: this.defaultSpeed.x,
      y: this.defaultSpeed.y
    };
    return this.currentSpeed = {
      x: 0,
      y: 0
    };
  };

  return Player;

})(Object);

Ball = (function(superClass) {
  extend(Ball, superClass);

  function Ball(el, speed1, gm) {
    this.el = el;
    this.speed = speed1;
    this.gm = gm;
    this.defaultSpeed = {
      x: this.speed.x,
      y: this.speed.y
    };
    Ball.__super__.constructor.call(this, this.el, this.gm);
  }

  Ball.prototype._update = function() {
    var collision, i, j, len, len1, object, ref, ref1;
    collision = false;
    ref = this.gm.objects;
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      if (!(!collision && !(object instanceof Ball) && this.checkCollision(object))) {
        continue;
      }
      this.speed.x *= -1.05;
      this.speed.y *= 1.05;
      this.speed.y += (object.currentSpeed.y || 0) * 0.25;
      ref1 = this.gm.objects;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        object = ref1[j];
        if (object instanceof Player) {
          object.speed.y *= 1.05;
        }
      }
      if (this.speed.x > 0) {
        this.x(object.right());
      } else {
        this.x(object.left() - this.width());
      }
      collision = true;
    }
    if (this.speed.x < 0) {
      this.el.addClass("inverted");
    } else {
      this.el.removeClass("inverted");
    }
    return this.move();
  };

  Ball.prototype.collisionX = function(player) {
    var i, len, object, ref, results;
    this.speed.x = -this.speed.x;
    if (player === this.gm.leftPlayer || player === this.gm.rightPlayer) {
      this.gm.scores[(player + 1) % 2]++;
      ref = this.gm.objects;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        object = ref[i];
        results.push(object.restart());
      }
      return results;
    }
  };

  Ball.prototype.collisionY = function() {
    return this.speed.y *= -0.95;
  };

  Ball.prototype.restart = function() {
    Ball.__super__.restart.call(this);
    this.speed.x = this.defaultSpeed.x;
    this.speed.y = this.defaultSpeed.y;
    return this.gm.updateScores();
  };

  return Ball;

})(Object);

Network = (function() {
  function Network(gm, events) {
    this.gm = gm;
    this.events = events;
    this.host = false;
    this.socket = null;
    this.initSocket();
  }

  Network.prototype.emitScores = function(scores) {
    if (this.host) {
      return this.socket.emit("scores", scores);
    }
  };

  Network.prototype.emitBall = function(ball) {
    if (this.host) {
      return this.socket.emit("ball", ball.x(), ball.y(), ball.speed);
    }
  };

  Network.prototype.initSocket = function() {
    var self;
    this.socket = io(location.origin);
    self = this;
    this.socket.on("start", function(speed, _host) {
      self.host = _host;
      self.gm.startGame(speed);
      return self.gm.ready = true;
    });
    this.socket.on("stop", function() {
      self.gm.ready = false;
      self.gm.updateScores([0, 0]);
      return self.gm.restart();
    });
    this.socket.on("ball", function(x, y, speed) {
      var ball;
      ball = self.gm.objects[2];
      ball.x(pongScreen.width - x - ball.width());
      ball.y(y);
      return ball.speed = {
        x: -speed.x,
        y: speed.y
      };
    });
    this.socket.on("scores", function(scores) {
      return self.gm.updateScores(scores.reverse());
    });
    this.socket.on("keydown", function(keyCode) {
      self.events.events.other[keyCode] = true;
      console.log("him: down:", keyCode, Date.now());
      if (keyCode === self.events.keyCodes.p) {
        return self.gm.pause();
      }
    });
    return this.socket.on("keyup", function(keyCode) {
      self.events.events.other[keyCode] = false;
      return console.log("him: up:", keyCode, Date.now());
    });
  };

  return Network;

})();

GameManager = (function() {
  function GameManager() {
    this.events = new Events(this);
    this.network = new Network(this, this.events);
    this.scores = null;
    this.leftPlayer = 0;
    this.rightPlayer = 1;
    this.objects = [
      new Player($("#player1"), true, this, this.events), new Player($("#player2"), null, this, this.events), new Ball($(".ball"), {
        x: 275,
        y: -275
      }, this)
    ];
    this.ready = this.paused = false;
  }

  GameManager.prototype.updateScores = function(_scores) {
    var scoreText;
    scoreText = $("#score");
    this.scores = _scores || this.scores;
    if (this.network.host || (_scores != null)) {
      scoreText.text(this.scores[0] + " - " + this.scores[1]);
      scoreText.css("left", pongScreen.width / 2 - scoreText.width() / 2);
    }
    if (this.network.host) {
      return this.network.emitScores(this.scores);
    }
  };

  GameManager.prototype.startGame = function(speed) {
    var i, len, object, ref, results;
    ref = this.objects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      if (object instanceof Ball) {
        results.push(object.speed = speed);
      }
    }
    return results;
  };

  GameManager.prototype.restart = function() {
    var i, len, object, ref;
    ref = this.objects;
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      object.restart();
    }
    return this.updateScores([0, 0]);
  };

  GameManager.prototype.pause = function() {
    this.paused = !this.paused;
    return $("#paused").toggle();
  };

  GameManager.prototype.gameLoop = function() {
    var frameCount, self;
    frameCount = 0;
    self = this;
    return setInterval(function() {
      var i, len, object, ref;
      if (self.ready && !self.paused) {
        ref = self.objects;
        for (i = 0, len = ref.length; i < len; i++) {
          object = ref[i];
          object.update();
        }
        if (self.network.host) {
          if (++frameCount >= 1) {
            frameCount = 0;
            return self.network.emitBall(self.objects[2]);
          }
        }
      }
    }, 1000 / 60);
  };

  return GameManager;

})();

pongScreen = {
  width: 854,
  height: 480
};

gameManager = null;

$(function() {
  var pausedText;
  pausedText = $("#paused");
  pausedText.css("left", pongScreen.width / 2 - pausedText.width() / 2);
  gameManager = new GameManager();
  gameManager.updateScores([0, 0]);
  return gameManager.gameLoop();
});

Events = (function() {
  function Events(gm) {
    this.gm = gm;
    this.keyCodes = {
      w: 87,
      s: 83,
      p: 80
    };
    this.events = {
      other: {}
    };
    this.registerEvents();
  }

  Events.prototype.registerEvents = function() {
    this.registerKeyDownEvents();
    return this.registerKeyUpEvents();
  };

  Events.prototype.registerKeyDownEvents = function() {
    var self;
    self = this;
    return $(document).on("keydown", function(event) {
      if (!self.events[event.keyCode]) {
        self.events[event.keyCode] = !self.events[event.keyCode];
        self.gm.network.socket.emit("keydown", event.keyCode);
        console.log("me: down:", event.keyCode, Date.now());
        if (event.keyCode === self.keyCodes.p) {
          return self.gm.pause();
        }
      }
    });
  };

  Events.prototype.registerKeyUpEvents = function() {
    var self;
    self = this;
    return $(document).on("keyup", function(event) {
      if (self.events[event.keyCode]) {
        self.events[event.keyCode] = false;
        self.gm.network.socket.emit("keyup", event.keyCode);
        return console.log("me: up:", event.keyCode, Date.now());
      }
    });
  };

  Events.prototype.selfStopped = function() {
    return !this.events[this.keyCodes.w] && !this.events[this.keyCodes.s];
  };

  Events.prototype.selfMovingUp = function() {
    return this.events[this.keyCodes.w];
  };

  Events.prototype.selfMovingDown = function() {
    return this.events[this.keyCodes.s];
  };

  Events.prototype.otherMovingUp = function() {
    return this.events.other[this.keyCodes.w];
  };

  Events.prototype.otherMovingDown = function() {
    return this.events.other[this.keyCodes.s];
  };

  return Events;

})();
