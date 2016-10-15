var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

function respondToClient(request, response){
    console.log(request);
    console.log(request.connection.remoteAddress);
    console.log(request.path);
    response.end("Hello, client!");
}


app.listen(8000);


app.get('/*', respondToClient);


var users = {}

// POST method route
app.post('/hello', function (req, res) {
    var id = req.body.id;
    var uname = req.body.username;
    console.log("HELLO\n\tID", id, "\n\tUN", uname);
    res.end("hello from server");
});

function unameAvailable(uname){
    if(uname === "Leon"){
        return false;
    }else{
        return true;
    }
    
}

app.post('/unameRequest', function (req, res) {
    var req_uname = req.body.unameRequested;
    console.log("\trequested name:", req_uname);
    console.log("\tavailable:", unameAvailable(req_uname));
    if(unameAvailable(req_uname)){
        console.log("in available");
        res.end("available");
    }else{
        console.log("in unavailable");
        res.end("unavailable");
    }
    res.end("bla");
});

