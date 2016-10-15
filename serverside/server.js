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
    if(!users[id]){
       users[id] = {}
       users[id]["username"] = uname;
       console.log("USERS\n\t", users);
    }
    console.log("HELLO\n\tID", id, "\n\tUN", uname);
    res.end("hello from server");
    
});


function unameAvailable(uname){
    if(uname.indexOf(' ') != -1) return false; //checks for spaces
    var usernames = {};
    var allIDs = Object.keys(users);
    for(var i = 0; i < allIDs.length; i++){
        var takenName = users[allIDs[i]]["username"];
        if(uname === takenName){
           return false; 
        }
    }
    return true;
    
}

app.post('/unameRequest', function (req, res) {
    var req_uname = req.body.unameRequested;
    // console.log("\trequested name:", req_uname);
    // console.log("\tavailable:", unameAvailable(req_uname));
    console.log("REQUEST: username\n\tUN", req_uname, "\n\tavailable:", unameAvailable(req_uname));
    if(unameAvailable(req_uname)){
        res.end("available");
    }else{
        res.end("unavailable");
    }
    res.end("bla");
});

