#= require Object

class Ball extends Object
  constructor: (@el, @speed) ->
    super @el
    @defaultSpeed = @speed

  _update: ->
    collision = false

    for object in objects when not collision and not(object instanceof Ball) and @checkCollision(object)
      @speed.x *= -1.05
      @speed.y *= 1.05

      for object in objects when object instanceof Player
        object.speed.y *= 1.05

      if @speed.x > 0
        @x object.right()
      else
        @x object.left() - @width()

      collision = true

    if @speed.x < 0
      @el.addClass("inverted")
    else
      @el.removeClass("inverted")

    @move()

  collisionX: (player) ->
    @speed.x = - @speed.x
    if player is leftPlayer or player is rightPlayer
      scores[player]++
      for object in objects
          object.restart()

  collisionY: ->
    @speed.y *= -0.95

  restart: ->
    super()
    @speed.x = @defaultSpeed.x if @defaultSpeed
    @speed.y = @defaultSpeed.y if @defaultSpeed
    updateScores()
