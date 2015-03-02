#= require Player
#= require Ball

keyCodes =
  w: 87
  s: 83
  p: 80

events = other: {}
pongScreen = width: 854, height: 480
leftPlayer = 0
rightPlayer = 1
scores = [0, 0]
objects = null

$ ->
  objects = [
    new Player($("#player1"), true)
    new Player($("#player2")),
    new Ball($(".ball"), {x: 200, y: -200})
  ]
  
  paused = $("#paused")
  paused.css("left", pongScreen.width / 2 - paused.width() / 2) 
  
  score = $("#score")
  $("#score").text(scores[0] + " - " + scores[1]); 
  score.css("left", pongScreen.width / 2 - score.width() / 2)
    
  setInterval( ->
    object.update() for object in objects
  , 100 / 6)

  socket = io location.origin

  socket.on "keydown", (data) ->
    events.other[data] = true

  socket.on "keyup", (data) ->
    events.other[data] = false

  $(document).on "keydown", (event) ->
    if event.keyCode == keyCodes.p 
      events[event.keyCode] = !events[event.keyCode]
      $("#paused").toggle()
    else 
      events[event.keyCode] = true
    socket.emit "keydown", event.keyCode

  $(document).on "keyup", (event) ->
    if event.keyCode != keyCodes.p
      events[event.keyCode] = false
      socket.emit "keyup", event.keyCode