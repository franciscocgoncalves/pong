class Object
  constructor: (@el, @speed = x: 0, y: 0) ->

  x: (x) ->
    @el.css("left", x) if x?
    parseFloat @el.css "left"

  y: (y) ->
    @el.css("bottom", y + "px") if y?
    parseFloat @el.css "bottom"

  moveY: ->
    finalY = @y() + @speed.y * @delta / 1000
    if finalY < 0
      @y 0
    else if finalY + @el.height() > screen.height
      @y screen.height
    else
      @y finalY

  moveUp: ->
    @speed.y = Math.abs @speed.y
    @moveY()

  moveDown: ->
    @speed.y = - Math.abs @speed.y
    @moveY()

  update: ->
    if !@updated?
      @updated = Date.now()
      return

    @delta = Date.now() - @updated

    if events[keyCodes.w]
      @moveUp()
    if events[keyCodes.s]
      @moveDown()

    @updated = @updated + @delta
