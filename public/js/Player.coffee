#= require Object

class Player extends Object
  constructor: (@el) ->
    super @el, x: 0, y: 200
