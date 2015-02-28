#= require Player

keyCodes =
  w: 87
  s: 83

events = other: {}
pongScreen = width: 854, height: 480

$ ->
  objects = [
    new Player($("#player1"), true)
    new Player($("#player2"))
  ]

  setInterval( ->
    object.update() for object in objects
  , 100 / 6)

  socket = io location.origin

  socket.on "keydown", (data) ->
    events.other[data] = true

  socket.on "keyup", (data) ->
    events.other[data] = false

  $(document).on "keydown", (event) ->
    events[event.keyCode] = true
    socket.emit "keydown", event.keyCode

  $(document).on "keyup", (event) ->
    events[event.keyCode] = false
    socket.emit "keyup", event.keyCode
