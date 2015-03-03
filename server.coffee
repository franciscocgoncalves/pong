exec = require("child_process").exec
spawn = require("child_process").spawn
Hapi = require "hapi"
SocketIO = require "socket.io"

isDev = process.argv[2]

exec "npm i", ->
  if isDev
    spawn "jade", ["-w", "./public/templates"]#, stdio: "inherit"
    spawn "sass", ["-w", "./public/stylesheets"]#, stdio: "inherit"
    exec "coffeescript-concat -I ./public/js -o ./public/js/app", ->
      spawn("coffee", ["-cb", "./public/js/app"], stdio: "inherit").on "close", ->
        exec "rm -rf ./public/js/app", ->
          startServer()
  else
    startServer()

startServer = ->
  server = new Hapi.Server()
  server.connection address: "0.0.0.0", port: 80

  games = {}

  io = SocketIO.listen server.listener
  io.on "connect", (socket) ->
    found = false
    for id, game of games when game.length < 2
      found = true
      game.push(socket)
      socket.gameId = id

      ballSpeed = x: 200 + parseInt(Math.random() * 101)
      ballSpeed.y = parseInt(Math.sqrt(400**2 - ballSpeed.x**2))

      for socket in game
        socket.emit "start", ballSpeed, (socket == game[0])
        ballSpeed.x = - ballSpeed.x

    if not found
      games[socket.id] = [socket]
      socket.gameId = socket.id

    socket.on "ball", (x, y, speed) ->
      for s in games[socket.gameId] when s.id != socket.id
        s.emit "ball", x, y, speed

    socket.on "scores", (scores) ->
      for s in games[socket.gameId] when s.id != socket.id
        s.emit "scores", scores

    socket.on "keydown", (data) ->
      for s in games[socket.gameId] when s.id != socket.id
        s.emit "keydown", data

    socket.on "keyup", (data) ->
      for s in games[socket.gameId] when s.id != socket.id
        s.emit "keyup", data

    socket.on "disconnect", ->
      if games[socket.gameId].length < 2
        delete games[socket.gameId]
      else
        for s in games[socket.gameId] when s.id != socket.id
          s.emit "stop"
          games[socket.gameId] = [s]

  server.route
    method: "GET"
    path: "/"
    config:
      handler:
        file: "./public/templates/index.html"

  server.route
    method: "GET"
    path: "/{path*}"
    config:
      handler:
        directory:
          path: "./public/"

  server.start ->
      console.log "Server running at:", server.info.uri
