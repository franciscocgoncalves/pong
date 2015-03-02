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

  socket.on "keydown", (keyCode) ->
    events.other[keyCode] = true
    console.log "him: down:", keyCode, Date.now()

  socket.on "keyup", (keyCode) ->
    events.other[keyCode] = false
    console.log "him: up:", keyCode, Date.now()

  $(document).on "keydown", (event) ->
    if not events[event.keyCode]
      events[event.keyCode] = true
      socket.emit "keydown", event.keyCode
      console.log "me: down:", event.keyCode, Date.now()

  $(document).on "keyup", (event) ->
    if events[event.keyCode]
      events[event.keyCode] = false
      socket.emit "keyup", event.keyCode
      console.log "me: up:", event.keyCode, Date.now()
