class Object
  constructor: (@el) ->

  x: (x) ->
    @el.css("left", x) if x?
    parseFloat @el.css "left"

  y: (y) ->
    @el.css("bottom", y) if y?
    parseFloat @el.css "bottom"
  
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
    