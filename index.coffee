exec = child_process.exec
Hapi = require("hapi")

exec "npm i", ->
  server = new Hapi.Server()
  server.connection port: 8080

  server.route
    method: "GET"
    path: "/{path*}"
    config:
      handler:
        directory:
          path: "./public/"

  server.start ->
      console.log "Server running at:", server.info.uri
