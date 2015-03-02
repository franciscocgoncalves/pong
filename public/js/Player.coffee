#= require Object

class Player extends Object
  constructor: (@el, @self) ->
    super @el
    @y(pongScreen.height / 2 - @height() / 2)

    if @self?
      @x(20)
      @color("green")
    else
      @x(pongScreen.width - @width() - 20)
      @color("red")

  moveUp: ->
    @move x: 0, y: 200

  moveDown: ->
    @move x: 0, y: -200

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
