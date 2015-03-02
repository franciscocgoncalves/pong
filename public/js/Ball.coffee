#= require Object

class Ball extends Object
  constructor: (@el, @speed) ->
    super @el
    @y(pongScreen.height / 2)
    @x(pongScreen.width /2)

  _update: ->
    collision = false

    for object in objects when not collision and not(object instanceof Ball) and @checkCollision(object)
      @speed.x *= -1
      collision = true

    @move()

  collisionX: (p) ->
    @speed.x = - @speed.x
    if p == leftPlayer
      scores[rightPlayer]++
      @restart()
    else if p == rightPlayer
      scores[leftPlayer]++
      @restart()

  collisionY: ->
    @speed.y = - @speed.y

  restart: ->
    $("#score").text(scores[0] + " - " + scores[1]);
    @y(pongScreen.height / 2)
    @x(pongScreen.width / 2)
