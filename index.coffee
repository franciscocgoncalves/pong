exec = require("child_process").exec
Hapi = require "hapi"
SocketIO = require "socket.io"

isDev = process.argv[2]

exec "npm prune", ->
  exec "npm i", ->
    if isDev
      exec "jade -w ."
      exec "sass -w ."
      exec "coffeescript-concat -I ./public/js -o ./public/js/app", ->
        exec "coffee -cb ./public/js/app", ->
          startServer()
    else
      startServer()

startServer = ->
  server = new Hapi.Server()
  server.connection address: "0.0.0.0", port: 80

  games = {}

  io = SocketIO.listen server.listener
  io.on "connection", (socket) ->
    found = false
    for id, game of games when game.length < 2
      found = true
      game.push(socket)
      socket.gameId = id

      for socket in game
        socket.emit("start")

    if not found
      games[socket.id] = [socket]
      socket.gameId = socket.id

    socket.on "keydown", (data) ->
      for s in games[socket.gameId] when s.id != socket.id
        s.emit "keydown", data

    socket.on "keyup", (data) ->
      for s in games[socket.gameId] when s.id != socket.id
        s.emit "keyup", data

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
