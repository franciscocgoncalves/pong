#= require Object

class Ball extends Object
  constructor: (@el, @speed) ->
    super @el
    @y(pongScreen.height / 2)
    @x(pongScreen.width /2)

  _update: ->    
    @move()
    if @checkCollision(player1) || @checkCollision(player2) 
      @speed.x = - @speed.x
    
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
    @y(pongScreen.height / 2)
    @x(pongScreen.width /2)