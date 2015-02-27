#= require Player

$ ->
  player1 = new Player $ "#player1"
  console.log player1.x()
  setTimeout((() ->
    player1.x(100)
    ), 2000)