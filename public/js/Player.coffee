#= require Object

class Player extends Object
  constructor: (@el, @self) ->
    super @el
    @speed = x: 0, y : 400

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
    @restartY()
