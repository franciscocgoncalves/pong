// Generated by CoffeeScript 1.9.1
var Hapi, SocketIO, exec, isDev, spawn, startServer;

exec = require("child_process").exec;

spawn = require("child_process").spawn;

Hapi = require("hapi");

SocketIO = require("socket.io");

isDev = process.argv[2];

exec("npm i", function() {
  if (isDev) {
    spawn("jade", ["-w", "./public/templates"]);
    spawn("sass", ["-w", "./public/stylesheets"]);
    return exec("coffeescript-concat -I ./public/js -o ./public/js/app", function() {
      return spawn("coffee", ["-cb", "./public/js/app"], {
        stdio: "inherit"
      }).on("close", function() {
        return exec("rm -rf ./public/js/app", function() {
          return startServer();
        });
      });
    });
  } else {
    return startServer();
  }
});

startServer = function() {
  var games, io, server;
  server = new Hapi.Server();
  server.connection({
    address: "0.0.0.0",
    port: 80
  });
  games = {};
  io = SocketIO.listen(server.listener);
  io.on("connect", function(socket) {
    var ballSpeed, found, game, i, id, len;
    found = false;
    for (id in games) {
      game = games[id];
      if (!(game.length < 2)) {
        continue;
      }
      found = true;
      game.push(socket);
      socket.gameId = id;
      ballSpeed = {
        x: 100 + parseInt(Math.random() * 101)
      };
      ballSpeed.y = parseInt(Math.sqrt(Math.pow(400, 2) - Math.pow(ballSpeed.x, 2)));
      for (i = 0, len = game.length; i < len; i++) {
        socket = game[i];
        socket.emit("start", ballSpeed);
        ballSpeed.x = -ballSpeed.x;
      }
    }
    if (!found) {
      games[socket.id] = [socket];
      socket.gameId = socket.id;
    }
    socket.on("keydown", function(data) {
      var j, len1, ref, results, s;
      ref = games[socket.gameId];
      results = [];
      for (j = 0, len1 = ref.length; j < len1; j++) {
        s = ref[j];
        if (s.id !== socket.id) {
          results.push(s.emit("keydown", data));
        }
      }
      return results;
    });
    socket.on("keyup", function(data) {
      var j, len1, ref, results, s;
      ref = games[socket.gameId];
      results = [];
      for (j = 0, len1 = ref.length; j < len1; j++) {
        s = ref[j];
        if (s.id !== socket.id) {
          results.push(s.emit("keyup", data));
        }
      }
      return results;
    });
    return socket.on("disconnect", function() {
      var j, len1, ref, results, s;
      if (games[socket.gameId].length < 2) {
        return delete games[socket.gameId];
      } else {
        ref = games[socket.gameId];
        results = [];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          s = ref[j];
          if (!(s.id !== socket.id)) {
            continue;
          }
          s.emit("stop");
          results.push(games[socket.gameId] = [s]);
        }
        return results;
      }
    });
  });
  server.route({
    method: "GET",
    path: "/",
    config: {
      handler: {
        file: "./public/templates/index.html"
      }
    }
  });
  server.route({
    method: "GET",
    path: "/{path*}",
    config: {
      handler: {
        directory: {
          path: "./public/"
        }
      }
    }
  });
  return server.start(function() {
    return console.log("Server running at:", server.info.uri);
  });
};
