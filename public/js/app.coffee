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
ready = paused = false
host = false

$ ->
  pausedText = $("#paused")
  pausedText.css("left", pongScreen.width / 2 - pausedText.width() / 2)

  scoreText = $("#score")
  scoreText.text(scores[0] + " - " + scores[1]);
  scoreText.css("left", pongScreen.width / 2 - scoreText.width() / 2)

  objects = [
    new Player($("#player1"), true)
    new Player($("#player2"))
    new Ball($(".ball"), {x: 200, y: -200})
  ]

  frameCount = 0

  setInterval( ->
    if ready and not paused
      for object in objects
        object.update()
      if host
        if ++frameCount >= 20
          frameCount = 0
          socket.emit "ball", objects[2].x(), objects[2].y()
  , 1000 / 60)

  socket = io location.origin

  socket.on "start", (speed, _host) ->
    host = _host
    for object in objects when object instanceof Ball
      object.speed = speed
    ready = true

  socket.on "stop", ->
    ready = false

    for object in objects
      object.restart()

  socket.on "ball", (x, y) ->
    objects[2].x(x)
    objects[2].y(y)

  socket.on "keydown", (keyCode) ->
    events.other[keyCode] = true
    console.log "him: down:", keyCode, Date.now()

    if keyCode == keyCodes.p
      paused = !paused
      $("#paused").toggle()

  socket.on "keyup", (keyCode) ->
    events.other[keyCode] = false
    console.log "him: up:", keyCode, Date.now()

  $(document).on "keydown", (event) ->
    if not events[event.keyCode]
      events[event.keyCode] = !events[event.keyCode]
      socket.emit "keydown", event.keyCode
      console.log "me: down:", event.keyCode, Date.now()

      if event.keyCode == keyCodes.p
        paused = !paused
        $("#paused").toggle()

  $(document).on "keyup", (event) ->
    if events[event.keyCode]
      events[event.keyCode] = false
      socket.emit "keyup", event.keyCode
      console.log "me: up:", event.keyCode, Date.now()
