const util = require('util')

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// function respondToClient(request, response){
//     console.log(request);
//     console.log(request.connection.remoteAddress);
//     console.log(request.path);
//     response.end("Hello, client!");
// }


app.listen(8000);


// app.get('/*', respondToClient);


var users = {}

// POST method route
app.post('/hello', function (req, res) {
    var FCsecretID = req.body.FCsecretID
    var FCpeerID = req.body.FCpeerID
    var FCusername = req.body.FCusername

    // console.log("FCsecretID", FCsecretID);
    // console.log("FCpeerID", FCpeerID);
    // console.log("FCusername", FCusername);

    if(users[FCsecretID] && users[FCsecretID]["FCusername"] != FCusername){
        console.log("[-] not autheticated user.");
        res.end("DONT KNOW YOU");
    }else if(!users[FCsecretID]){
        users[FCsecretID] = {}
        users[FCsecretID]["FCusername"] = FCusername;
        users[FCsecretID]["FCsecretID"] = FCsecretID;
        users[FCsecretID]["FCpeerID"] = FCpeerID;

        users[FCsecretID]["FCfriends"] = {};
        users[FCsecretID]["FCfriends"]["pending"] = [];
        users[FCsecretID]["FCfriends"]["confirmed"] = [];

        users[FCsecretID]["FCextensions"] = [];

        console.log("USERS\n\t", users);

    }

    console.log("HELLO\n\tFCsecretID", FCsecretID, "\n\tFCpeerID", FCpeerID, "\n\tFCusername", FCusername);
    

    var reply = users[FCsecretID]["FCfriends"];


    // var confirmed = users[id]["friends"]["confirmed"];
    // console.log(confirmed);
    // reply["confirmed"] = {};
    // for(var i = 0; i < confirmed.length; i++){
    //     console.log(confirmed[i]);
    //     reply["confirmed"][confirmed[i]] = IDfromUname(confirmed[i]);
    // }

    console.log("reply\n\t", util.inspect(reply, false, null));
    

    res.end(JSON.stringify(reply));
    
});


function unameAvailable(uname){
    if(uname.indexOf(' ') != -1) return false; //checks for spaces
    var allIDs = Object.keys(users);
    for(var i = 0; i < allIDs.length; i++){
        var takenName = users[allIDs[i]]["username"];
        if(uname === takenName) return false; 
    }
    return true;  
}
app.post('/unameRequest', function (req, res) {
    var req_uname = req.body.unameRequested;
    console.log("REQUEST: username\n\tUN", req_uname, "\n\tavailable", unameAvailable(req_uname));
    if(unameAvailable(req_uname)){
        res.end("available");
    }else{
        res.end("unavailable");
    }
});

function IDfromUname(uname){
    var allIDs = Object.keys(users);
    for(var i = 0; i < allIDs.length; i++){
        var un = users[allIDs[i]]["username"];
        if(un === uname) return allIDs[i];
    }
}

function areFriends(uname1, uname2){
    var IDuname1 = IDfromUname(uname1);
    var allFriendsOfUname1 = users[IDuname1]["friends"]["confirmed"];
    for(var i = 0; i < allFriendsOfUname1.length; i++){
        if(allFriendsOfUname1[i] === uname2) return true;
    } 
    return false;
}
function alreadyPending(uname1, possiblyPending){
    var IDuname1 = IDfromUname(uname1);
    var pendingFriendsOfUname1 = users[IDuname1]["friends"]["pending"];
    for(var i = 0; i < pendingFriendsOfUname1.length; i++){
        if(pendingFriendsOfUname1[i] === possiblyPending) return true;
    } 
    return false;
}

function possibleFriend(uname, friendName){
    if(uname === friendName) return false;
    if(alreadyPending(uname, friendName)) return false;
    var allIDs = Object.keys(users);
    for(var i = 0; i < allIDs.length; i++){
        var takenName = users[allIDs[i]]["username"];
        if(friendName === takenName){
            if(areFriends(uname, friendName)) return false;
            return true; 
        }
    }
    return false;  
}

function deleteFromPending(uname, toDelete){
    var pending = users[IDfromUname(uname)]["friends"]["pending"];
    var index = pending.indexOf(toDelete);
    if (index > -1) {
        pending.splice(index, 1);
    }

}


app.post('/addfriend', function (req, res) {
    var ID = req.body.id;
    var uname = req.body.username;
    var req_friend = req.body.data.name;
    console.log("REQUEST: friend\n\tUN", uname, "\n\ttoAdd", req_friend, "\n\texists", possibleFriend(uname,req_friend));
    if(possibleFriend(uname,req_friend)){
        
        if(alreadyPending(req_friend,uname)){
            // if the other person already added uname, then we declare 
            // them friends and delete uname out of reqfriends pending
            users[ID]["friends"]["confirmed"].push(req_friend);
            users[IDfromUname(req_friend)]["friends"]["confirmed"].push(uname);
            deleteFromPending(req_friend, uname);
            var reply = {"status": "friends", "friendID": IDfromUname(req_friend)};
            res.end(JSON.stringify(reply));
        }else{
            users[ID]["friends"]["pending"].push(req_friend);
            var reply = {"status": "pending"};
            res.end(JSON.stringify(reply));
        }
        
    }else{
        var reply = {"status": "unavailable"};
        res.end(JSON.stringify(reply));
    }
    console.log("USERS\n\t", util.inspect(users, false, null))
});

app.post('/extensions', function (req, res) {
    var ID = req.body.id;
    var extensions = req.body.data.extensions;
    console.log("EXTENSIONS");
    console.log(ID);
    console.log(extensions);
    // var req_friend = req.body.data.name;
    // console.log("REQUEST: friend\n\tUN", uname, "\n\ttoAdd", req_friend, "\n\texists", possibleFriend(uname,req_friend));
    // if(possibleFriend(uname,req_friend)){
        
    //     if(alreadyPending(req_friend,uname)){
    //         // if the other person already added uname, then we declare 
    //         // them friends and delete uname out of reqfriends pending
    //         users[ID]["friends"]["confirmed"].push(req_friend);
    //         users[IDfromUname(req_friend)]["friends"]["confirmed"].push(uname);
    //         deleteFromPending(req_friend, uname);
    //         var reply = {"status": "friends", "friendID": IDfromUname(req_friend)};
    //         res.end(JSON.stringify(reply));
    //     }else{
    //         users[ID]["friends"]["pending"].push(req_friend);
    //         var reply = {"status": "pending"};
    //         res.end(JSON.stringify(reply));
    //     }
        
    // }else{
    //     var reply = {"status": "unavailable"};
    //     res.end(JSON.stringify(reply));
    // }
    // console.log("USERS\n\t", util.inspect(users, false, null))
});
