#= require Object

class Player extends Object
  constructor: (@el, @self) ->
    @defaultSpeed = x: 0, y : 400
    super @el

    if @self?
      @x(20)
      @color("green")
    else
      @x(pongScreen.width - @width() - 20)
      @color("red")

  moveUp: ->
    @currentSpeed.y = @speed.y
    @move @currentSpeed

  moveDown: ->
    @currentSpeed.y = - @speed.y
    @move @currentSpeed

  _update: ->
    if @self?
      if not events[keyCodes.w] and not events[keyCodes.s]
        @currentSpeed.y = 0
      else
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
    @speed = x: @defaultSpeed.x, y: @defaultSpeed.y
    @currentSpeed = x: 0, y: 0
