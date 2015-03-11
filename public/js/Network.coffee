class Network 
  constructor: (@gm, @events) ->
    @host = false
    @socket = null
    @initSocket()
    
  emitScores: (scores) ->
    if @host
      @socket.emit "scores", scores
  
  emitBall: (ball) ->
    if @host
      @socket.emit "ball", ball.x(), ball.y(), ball.speed
    
  initSocket: ->
    @socket = io location.origin
    
    self = @
    
    @socket.on "start", (speed, _host) ->
      self.host = _host
      self.gm.startGame(speed) 
      self.gm.ready = true
      
    @socket.on "stop", ->
      self.gm.ready = false
      self.gm.updateScores([0, 0])
      self.gm.restart()
    
    @socket.on "ball", (x, y, speed) ->
      ball = self.gm.objects[2]
      ball.x(pongScreen.width - x - ball.width())
      ball.y(y)
      ball.speed = x: - speed.x, y: speed.y
    
    @socket.on "scores", (scores) ->
      self.gm.updateScores(scores.reverse())
    
    @socket.on "keydown", (keyCode) ->
      self.events.events.other[keyCode] = true
      console.log "him: down:", keyCode, Date.now()

      if keyCode == self.events.keyCodes.p
        self.gm.pause()

    @socket.on "keyup", (keyCode) ->
      self.events.events.other[keyCode] = false
      console.log "him: up:", keyCode, Date.now()