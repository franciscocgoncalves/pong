#= require Object

class Ball extends Object
  constructor: (@el, @speed) ->
    super @el

  _update: ->
    collision = false

    for object in objects when not collision and not(object instanceof Ball) and @checkCollision(object)
      @speed.x *= -1

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
    super()
    updateScores()
