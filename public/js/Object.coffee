class Object
  constructor: (@el) ->

  color: (color) ->
    if color?
      @el.css("background-color", color)
    else
      @el.css("background-color")

  x: (x) ->
    @el.css("left", x + "px") if x?    
    parseFloat @el.css "left"

  y: (y) ->
    @el.css("bottom", y + "px") if y?
    parseFloat @el.css "bottom"

  move: (speed) ->
    speed = speed || @speed || x: 0, y: 0
    
    finalY = @y() + speed.y * @delta / 1000
    finalX = @x() + speed.x * @delta / 1000            
                
    if finalY < 0 
      @y(0)
      @collisionY()
    else if finalY + @height() > pongScreen.height
      @y pongScreen.height - @height()
      @collisionY()
    else
      @y finalY
      
    if finalX < 0 
      @x(0)
      @collisionX(leftPlayer)
    else if finalX + @width() > pongScreen.width
      @x pongScreen.width - @width()
      @collisionX(rightPlayer)
    else
      @x finalX

  update: ->
    if !@updated?
      @updated = Date.now()
      return

    @delta = Date.now() - @updated

    @_update()

    @updated = @updated + @delta

  _update: ->

  width: ->
    @el.width()

  height: ->
    @el.height()

  left: ->
    @x()

  right: ->
    @x() + @width()

  up: ->
    @y() + @height()

  down: ->
   @y()

  checkCollision: (o) ->
    if(o.left() > @right() || o.right() < @left() || o.down() > @up() || o.up() < @down())
      return false
    return true
    
  collisionX: (p) ->
  
  collisionY: ->