class Events 
  constructor: (@gm) ->
    @keyCodes =
      w: 87
      s: 83
      p: 80 
    @events = other: {}
    @registerEvents()
    
  registerEvents: ->
    @registerKeyDownEvents()
    @registerKeyUpEvents()
    
  registerKeyDownEvents: ->
    self = @
    
    $(document).on "keydown", (event) ->
      if not self.events[event.keyCode]
        self.events[event.keyCode] = !self.events[event.keyCode]
        self.gm.network.socket.emit "keydown", event.keyCode
        console.log "me: down:", event.keyCode, Date.now()

        if event.keyCode == self.keyCodes.p
          self.gm.pause() 
  
  registerKeyUpEvents: ->
    self = @
    
    $(document).on "keyup", (event) ->
      if self.events[event.keyCode]
        self.events[event.keyCode] = false
        self.gm.network.socket.emit "keyup", event.keyCode
        console.log "me: up:", event.keyCode, Date.now()
        
  
  selfStopped: -> 
    not @events[@keyCodes.w] and not @events[@keyCodes.s]
  
  selfMovingUp: ->
    @events[@keyCodes.w]
  
  selfMovingDown: ->
    @events[@keyCodes.s]
    
  otherMovingUp: ->
    @events.other[@keyCodes.w]
    
  otherMovingDown: ->
    @events.other[@keyCodes.s]

  