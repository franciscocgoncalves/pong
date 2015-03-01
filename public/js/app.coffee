#= require Player
#= require Ball

keyCodes =
  w: 87
  s: 83

events = {}
pongScreen = width: 854, height: 480
leftPlayer = 0
player1 = null
player2 = null
rightPlayer = 1
scores = [0, 0]

$ ->
  $(document).on "keydown", (event) ->
    events[event.keyCode] = true

  $(document).on "keyup", (event) ->
    events[event.keyCode] = false

  player1 = new Player($("#player1"), true)
  player2 = new Player($("#player2"))
  ball = new Ball($(".ball"), {x: 200, y: -200})
  
  setInterval( ->
    player1.update()
    ball.update()
  , 100 / 6)
