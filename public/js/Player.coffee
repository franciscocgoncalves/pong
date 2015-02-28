#= require Object

class Player extends Object
  constructor: (@el) ->
    super @el
    @y(pongScreen.height / 2 - @height() / 2)

  moveUp: ->
    @move x: 0, y: 200

  moveDown: ->
    @move x: 0, y: -200

  _update: ->
    if events[keyCodes.w]
      @moveUp()
    if events[keyCodes.s]
      @moveDown()
