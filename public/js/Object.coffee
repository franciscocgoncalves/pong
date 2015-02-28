class Object
  constructor: (@el) ->

  color: (color) ->
    if color?
      @el.css("background-color", color)
    else
      @el.css("background-color")

  x: (x) ->
    @el.css("left", x) if x?
    parseFloat @el.css "left"

  y: (y) ->
    @el.css("bottom", y + "px") if y?
    parseFloat @el.css "bottom"

  move: (speed) ->
    speed = speed || @speed || x: 0, y: 0

    finalY = @y() + speed.y * @delta / 1000
    if finalY < 0
      @y 0
    else if finalY + @height() > pongScreen.height
      @y pongScreen.height - @height()
    else
      @y finalY

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

  checkColision: (o) ->
    if ( o.left() >= @left() && o.left() <= @right() || o.right() <= @right() && o.right() >= @left() ) && (o.up() <= @up() && o.up() >= @down() || o.down() >= @down() && o.down() <= @up() )
      return true
    return false
