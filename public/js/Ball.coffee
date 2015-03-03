#= require Object

class Ball extends Object
  defaultSpeed = null
  
  constructor: (@el, @speed) ->
    super @el
    defaultSpeed = @speed
    
  _update: ->
    collision = false

    for object in objects when not collision and not(object instanceof Ball) and @checkCollision(object)
      @speed.x *= -1.1
      @speed.y *= 1.1
   
      @speed.y += (object.speed.y / 4)
      
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
    @speed.y = - 0.8 * @speed.y

  restart: ->
    super()
    @speed.x = defaultSpeed.x if defaultSpeed
    @speed.y = defaultSpeed.y if defaultSpeed
    if defaultSpeed
      console.log "AFINAL HA!!!"
    updateScores()
