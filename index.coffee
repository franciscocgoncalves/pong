exec = require("child_process").exec
Hapi = require "hapi"

isDev = process.argv[2]

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
  server.connection address: "0.0.0.0", port: 8080

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
