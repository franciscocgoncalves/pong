class Object
  constructor: (@el) ->

  x: (x) ->
    @el.css("left", x) if x?
    parseFloat @el.css "left"

  y: (y) ->
    @el.css("bottom", y) if y?
    parseFloat @el.css "bottom"
