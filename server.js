var connect = require('connect');
connect.createServer(
    connect.static(__dirname)
).listen(1337);
console.log("Listening on: http://localhost:1337");