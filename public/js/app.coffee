#= require Player

keyCodes =
  w: 87
  s: 83

events = {}
screen = null;

$ ->
  $(document).on "keydown", (event) ->
    events[event.keyCode] = true

  $(document).on "keyup", (event) ->
    events[event.keyCode] = false

  screen = $ ".screen"
  player1 = new Player $ "#player1"
  setInterval( ->
    player1.update()
  , 100 / 6)
