exec = require("child_process").exec
Hapi = require "hapi"

exec "npm i", ->
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
