#= require Player
#= require Ball
#= require Network

class GameManager 
  constructor:() ->
    @events = new Events(@)
    @network = new Network(@, @events)
    @scores = null
    @leftPlayer = 0
    @rightPlayer = 1
    @objects = [
      new Player($("#player1"), true, @, @events)
      new Player($("#player2"), null, @, @events)
      new Ball($(".ball"), {x: 275, y: -275}, @)
    ]
    @ready = @paused = false
  
  #create Score class
  updateScores: (_scores) ->
    scoreText = $("#score")
    @scores = _scores or @scores
    if @network.host or _scores?
      scoreText.text(@scores[0] + " - " + @scores[1])
      scoreText.css("left", pongScreen.width / 2 -     scoreText.width() / 2)
    
    if @network.host
      @network.emitScores(@scores)
    
  startGame: (speed) ->
    for object in @objects when object instanceof Ball
      object.speed = speed

  restart: () ->
    for object in @objects
      object.restart()
    @updateScores [0,0] 
    
  pause: () ->
    @paused = !@paused
    $("#paused").toggle()
    
  gameLoop: ->
    frameCount = 0
    self = @
    
    setInterval( ->
      if self.ready and not self.paused
        for object in self.objects
            object.update()
          if self.network.host
            if ++frameCount >= 1
              frameCount = 0
              self.network.emitBall self.objects[2]
    , 1000 / 60)
    
    