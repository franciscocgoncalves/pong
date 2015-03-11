#= require GameManager

pongScreen = width: 854, height: 480
gameManager = null

$ ->
  pausedText = $("#paused")
  pausedText.css("left", pongScreen.width / 2 - pausedText.width() / 2)
  
  gameManager = new GameManager()
  
  gameManager.updateScores([0, 0])
  gameManager.gameLoop()