const util = require('util')

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.listen(8000);

var users = {}

function authenticated(FCsecretID, FCpeerID, FCusername){
    if(!users[FCsecretID]){
        return false;
    }else if(users[FCsecretID]["FCusername"] != FCusername){
        return false;
    }else if(users[FCsecretID]["FCpeerID"] != FCpeerID){
        return false;
    }
    return true;

}

// POST method route
app.post('/hello', function (req, res) {
    var FCsecretID = req.body.FCsecretID;
    var FCpeerID = req.body.FCpeerID;
    var FCusername = req.body.FCusername;

    if(users[FCsecretID]){
        if(!authenticated(FCsecretID, FCpeerID, FCusername)){
            res.end("IDONT KNOW YOU");
        }
    }else if(!users[FCsecretID]){
        users[FCsecretID] = {}
        users[FCsecretID]["FCusername"] = FCusername;
        users[FCsecretID]["FCsecretID"] = FCsecretID;
        users[FCsecretID]["FCpeerID"] = FCpeerID;

        users[FCsecretID]["FCfriends"] = {};
        users[FCsecretID]["FCfriends"]["pending"] = [];
        users[FCsecretID]["FCfriends"]["confirmed"] = {};

        users[FCsecretID]["FCextensions"] = [];

        console.log("USERS\n\t", users);
    }

    console.log("HELLO\n\tFCsecretID", FCsecretID, "\n\tFCpeerID", FCpeerID, "\n\tFCusername", FCusername);
    var reply = users[FCsecretID]["FCfriends"];
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

function FCsecretIDfromUname(uname){
    var allIDs = Object.keys(users);
    for(var i = 0; i < allIDs.length; i++){
        var un = users[allIDs[i]]["FCusername"];
        if(un === uname) return allIDs[i];
    }
}

function areFriends(FCusername, uname2){
    var IDuname1 = FCsecretIDfromUname(FCusername);
    var allFriendsOfUname1 = Object.keys(users[IDuname1]["FCfriends"]["confirmed"]);
    for(var i = 0; i < allFriendsOfUname1.length; i++){
        if(allFriendsOfUname1[i] === uname2) return true;
    }
    return false;
}
function alreadyPending(FCusername, possiblyPending){
    var IDuname1 = FCsecretIDfromUname(FCusername);
    var pendingFriendsOfUname1 = users[IDuname1]["FCfriends"]["pending"];
    for(var i = 0; i < pendingFriendsOfUname1.length; i++){
        if(pendingFriendsOfUname1[i] === possiblyPending) return true;
    }
    return false;
}

function possibleFriend(FCusername, friendName){
    if(FCusername === friendName) return false;
    if(alreadyPending(FCusername, friendName)) return false;
    var allIDs = Object.keys(users);
    for(var i = 0; i < allIDs.length; i++){
        var takenName = users[allIDs[i]]["FCusername"];
        if(friendName === takenName){
            if(areFriends(FCusername, friendName)) return false;
            return true;
        }
    }
    return false;
}

function deleteFromPending(uname, toDelete){
    var pending = users[FCsecretIDfromUname(uname)]["FCfriends"]["pending"];
    var index = pending.indexOf(toDelete);
    if (index > -1) {
        pending.splice(index, 1);
    }

}

app.post('/addfriend', function (req, res) {
    var FCsecretID = req.body.FCsecretID;
    var FCpeerID = req.body.FCpeerID;
    var FCusername = req.body.FCusername;
    if(!authenticated(FCsecretID, FCpeerID, FCusername)){
        res.end("IDONT KNOW YOU");
    }

    var req_friend = req.body.data.name;
    console.log("REQUEST: friend\n\tFCusername", FCusername, "\n\ttoAdd", req_friend, "\n\texists", possibleFriend(FCusername,req_friend));
    if(possibleFriend(FCusername,req_friend)){

        if(alreadyPending(req_friend,FCusername)){
            // if the other person already added uname, then we declare
            // them friends and delete uname out of reqfriends pending
            users[FCsecretID]["FCfriends"]["confirmed"][req_friend] = {};
            users[FCsecretID]["FCfriends"]["confirmed"][req_friend]["FCusername"] = req_friend;
            users[FCsecretID]["FCfriends"]["confirmed"][req_friend]["FCpeerID"] = users[FCsecretIDfromUname(req_friend)]["FCpeerID"];
            users[FCsecretID]["FCfriends"]["confirmed"][req_friend]["FCextensions"] = users[FCsecretIDfromUname(req_friend)]["FCextensions"];;

            users[FCsecretIDfromUname(req_friend)]["FCfriends"]["confirmed"][FCusername] = {};
            users[FCsecretIDfromUname(req_friend)]["FCfriends"]["confirmed"][FCusername]["FCusername"] = users[FCsecretID]["FCusername"];
            users[FCsecretIDfromUname(req_friend)]["FCfriends"]["confirmed"][FCusername]["FCpeerID"] = users[FCsecretID]["FCpeerID"];
            users[FCsecretIDfromUname(req_friend)]["FCfriends"]["confirmed"][FCusername]["FCextensions"] = users[FCsecretID]["FCextensions"];

            deleteFromPending(req_friend, FCusername);
        }else{
            users[FCsecretID]["FCfriends"]["pending"].push(req_friend);
        }

        console.log("reply\n\t", util.inspect(users[FCsecretID]["FCfriends"], false, null));
        res.end(JSON.stringify({"status": "success", "FCfriends": users[FCsecretID]["FCfriends"]}));

    }else{
        var reply = {"status": "unavailable"};
        res.end(JSON.stringify(reply));
    }
    console.log("USERS\n\t", util.inspect(users, false, null));
});

app.post('/updateFriends', function (req, res) {
    var FCsecretID = req.body.FCsecretID;
    var FCpeerID = req.body.FCpeerID;
    var FCusername = req.body.FCusername;
    if(!authenticated(FCsecretID, FCpeerID, FCusername)){
        res.end("IDONT KNOW YOU");
    }
    users[FCsecretID]["FCfriends"]["FCextensions"] = req.body.data.extensions;
    console.log("TABS", FCusername, "\n\t", users[FCsecretID]["FCfriends"]["FCextensions"].length);

    console.log("UPDATING BACKGROUND PAGE\n\t", util.inspect(users[FCsecretID]["FCfriends"], false, null));
    res.end(JSON.stringify({"status": "success", "FCfriends": users[FCsecretID]["FCfriends"]}));

});


function updateExtensionsForFriends(FCsecretID, FCpeerID, FCusername, extensions){
    var friendsOfUserUsernames = Object.keys( users[FCsecretID]["FCfriends"]["confirmed"] );
    for (var i = 0; i < friendsOfUserUsernames.length; i++){
        users[FCsecretIDfromUname(friendsOfUserUsernames[i])]["FCfriends"]["confirmed"][FCusername]["FCextensions"] = extensions;
    }
}

app.post('/extensions', function (req, res) {
    var FCsecretID = req.body.FCsecretID;
    var FCpeerID = req.body.FCpeerID;
    var FCusername = req.body.FCusername;
    if(!authenticated(FCsecretID, FCpeerID, FCusername)){
        res.end("IDONT KNOW YOU");
    }
    users[FCsecretID]["FCfriends"]["FCextensions"] = req.body.data.extensions;
    updateExtensionsForFriends(FCsecretID, FCpeerID, FCusername, req.body.data.extensions);
    console.log("TABS", FCusername, "\n\t", users[FCsecretID]["FCfriends"]["FCextensions"].length);




    // var ID = req.body.id;
    // var extensions = req.body.data.extensions;
    // console.log("EXTENSIONS");
    // console.log(ID);
    // console.log(extensions);
    // // var req_friend = req.body.data.name;
    // // console.log("REQUEST: friend\n\tUN", uname, "\n\ttoAdd", req_friend, "\n\texists", possibleFriend(uname,req_friend));
    // // if(possibleFriend(uname,req_friend)){

    // //     if(alreadyPending(req_friend,uname)){
    // //         // if the other person already added uname, then we declare
    // //         // them friends and delete uname out of reqfriends pending
    // //         users[ID]["friends"]["confirmed"].push(req_friend);
    // //         users[FCsecretIDfromUname(req_friend)]["friends"]["confirmed"].push(uname);
    // //         deleteFromPending(req_friend, uname);
    // //         var reply = {"status": "friends", "friendID": FCsecretIDfromUname(req_friend)};
    // //         res.end(JSON.stringify(reply));
    // //     }else{
    // //         users[ID]["friends"]["pending"].push(req_friend);
    // //         var reply = {"status": "pending"};
    // //         res.end(JSON.stringify(reply));
    // //     }

    // // }else{
    // //     var reply = {"status": "unavailable"};
    // //     res.end(JSON.stringify(reply));
    // // }
    // // console.log("USERS\n\t", util.inspect(users, false, null))
});
