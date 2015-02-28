#= require Player

keyCodes =
  w: 87
  s: 83

events = {}
pongScreen = width: 854, height: 480

$ ->
  $(document).on "keydown", (event) ->
    events[event.keyCode] = true

  $(document).on "keyup", (event) ->
    events[event.keyCode] = false

  player1 = new Player $ "#player1"
  setInterval( ->
    player1.update()
  , 100 / 6)
