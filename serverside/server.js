var express = require('express');
var server = express();


function respondToClient(request, response){
    console.log(request);
    console.log(request.connection.remoteAddress);
    console.log(request.path);
    response.end("Hello, client!");
}


server.listen(8080);


server.get('/*', respondToClient);
app.post('/*', function(req, res) {
    console.log(req);
    response.end("Hello, client!");
});