#= require Object

class Player extends Object
  constructor: (@el, @self) ->
    @defaultSpeed = x: 0, y : 400
    @speed = x: 0, y : 400
    super @el

    if @self?
      @x(20)
      @color("green")
    else
      @x(pongScreen.width - @width() - 20)
      @color("red")

  moveUp: ->
    @move x: @speed.x, y: @speed.y

  moveDown: ->
    @move x: @speed.x, y: - @speed.y

  _update: ->
    if @self?
      if events[keyCodes.w]
        @moveUp()
      if events[keyCodes.s]
        @moveDown()
    else
      if events.other[keyCodes.w]
        @moveUp()
      if events.other[keyCodes.s]
        @moveDown()

  restart: ->
    @speed.x = @defaultSpeed.x
    @speed.y = @defaultSpeed.y
    @restartY()
