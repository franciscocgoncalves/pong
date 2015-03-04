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
scores = socket = objects = updateScores = null
ready = paused = host = false

$ ->
  pausedText = $("#paused")
  pausedText.css("left", pongScreen.width / 2 - pausedText.width() / 2)

  scoreText = $("#score")
  updateScores = (_scores) ->
    scores = _scores or scores
    if host or _scores?
      scoreText.text(scores[0] + " - " + scores[1])
      scoreText.css("left", pongScreen.width / 2 - scoreText.width() / 2)

      if host
        socket.emit "scores", scores
  updateScores([0, 0])

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
        if ++frameCount >= 1
          frameCount = 0
          socket.emit "ball", objects[2].x(), objects[2].y(), objects[2].speed
  , 1000 / 60)

  socket = io location.origin

  socket.on "start", (speed, _host) ->
    host = _host
    for object in objects when object instanceof Ball
      object.speed = speed
    ready = true

  socket.on "stop", ->
    ready = false
    updateScores([0, 0])
    for object in objects
      object.restart()

  socket.on "ball", (x, y, speed) ->
    ball = objects[2]
    ball.x(pongScreen.width - x - ball.width())
    ball.y(y)
    ball.speed = x: - speed.x, y: speed.y

  socket.on "scores", (scores) ->
    updateScores(scores.reverse())

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
