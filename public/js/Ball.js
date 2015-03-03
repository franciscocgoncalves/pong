// Generated by CoffeeScript 1.9.1
var Ball,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Ball = (function(superClass) {
  extend(Ball, superClass);

  function Ball(el, speed) {
    this.el = el;
    this.speed = speed;
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
      this.x(object.x);
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