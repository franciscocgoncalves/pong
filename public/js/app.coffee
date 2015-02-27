class Object
  constructor: (@el) ->

  x: (x) ->
    @el.css("left", x) if x?
    parseFloat @el.css "left"

  y: (y) ->
    @el.css("bottom", y) if y?
    parseFloat @el.css "bottom"

class Player extends Object

$ ->
  player1 = new Player $ "#player1"
  console.log player1.x()
  setTimeout((() ->
    player1.x(100)), 2000)
