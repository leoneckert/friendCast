function start(myID, username){

    var friends = {"pending": [], "confirmed": {}};
    // var confirmed = [];
    // var pending = [];

    function toServer(postkey, data, callback){   
        var xmlhttp = new XMLHttpRequest();       
        xmlhttp.open("POST", "http://104.236.30.108:8000/"+postkey, true);
        var toSend = {"id":myID, "username": username, "data":data};
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.onreadystatechange = function() {//Call a function when the state changes.
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200 && callback) {
                callback(xmlhttp.responseText);
            }
        }
        xmlhttp.send(JSON.stringify(toSend));
    }

    function addFriend(){
        console.log(pending);
        var friendToAdd = document.getElementById("friendText").value;
        console.log(username,"wants to add", friendToAdd,"as a friend.");
        toServer("addfriend", {"name": friendToAdd}, function(response){
            var res = JSON.parse(response);
            if(res["status"] === "pending"){
                friends["pending"].push(friendToAdd);
            }else if(res["status"] === "friends"){
                friends["pending"]["confirmed"][friendToAdd] = res["friendID"];
                // confirmed.push(friendToAdd);
            }
            console.log("ADDED FRIEND")
            console.dir(friends)
            renderPopup();
        })
    }

    function renderPopup(){
        document.body.innerHTML = "";
        
        // include welcome
        var welcome = document.createElement("h3");
        welcome.innerHTML = "Hello, " + username + "!";
        document.body.appendChild(welcome);

        //friends
        var friendsWrapper = document.createElement("div");
        friendsWrapper.id = "friendsWrapper";

        var confirmed = Object.keys(friends["confirmed"]);
        if(confirmed.length > 0){
            var confirmedFriends = document.createElement("div");
            confirmedFriends.id = "confirmedFriends";
            confirmedFriends.innerHTML = "<p><b>Your friends:</b></p>";
            for(var i = 0; i < confirmed.length; i++){
                confirmedFriends.innerHTML += "<p> >> "+confirmed[i]+" <a href=#>go live</a></p> ";
            }
            friendsWrapper.appendChild(confirmedFriends);
        }

        var pending = friends["pending"];
        if(pending.length > 0){
            var pendingFriends = document.createElement("div");
            pendingFriends.id = "pendingFriends";
            pendingFriends.innerHTML = "<p><b>Added:</b> (pending until they add you, too)</p>";
            for(var i = 0; i < pending.length; i++){
                pendingFriends.innerHTML += "<p>"+pending[i]+"</p>";
            }
            friendsWrapper.appendChild(pendingFriends);
        }
        document.body.appendChild(friendsWrapper);

        //friend adder
        var newFriendsWrapper = document.createElement("div");
        newFriendsWrapper.style.borderTop = "thin solid #000000";
        newFriendsWrapper.style.marginTop = "8px";
        newFriendsWrapper.style.paddingTop = "8px";
        newFriendsWrapper.id = "newFriendsWrapper";

        var friendText = document.createElement("input");
        friendText.type = "text";
        friendText.value = "Add a friend.";
        friendText.id = "friendText";
        newFriendsWrapper.appendChild(friendText);
        
        var friendSubmit = document.createElement("input");
        friendSubmit.type = "button";
        friendSubmit.value = "Add friend";
        friendSubmit.id = "friendSubmit";
        friendSubmit.addEventListener("click", addFriend);
        newFriendsWrapper.appendChild(friendSubmit);
        
        var friendNotExistNotification = document.createElement("p");
        friendNotExistNotification.id = "friend_not_exist_notification";
        newFriendsWrapper.appendChild(friendNotExistNotification);
        document.body.appendChild(newFriendsWrapper);

    }

    /////////////////////////// RUTIME ///////////////////////////

    // At this point, both ID and username are available, 
    // and a request function created to authenticate to the server.
    toServer("hello", {}, function(response){
        console.log("GOT MY FRIEND OBJ");
        console.dir(response);
        friends = JSON.parse(response);
        // confirmed = Object.keys(friends["confirmed"]);
        // pending = friends["pending"];
        // console.log(confirmed);
        // console.log(pending);
        renderPopup();
    });
    // renderPopup();
     
}









// from here: http://stackoverflow.com/a/105074
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function checkForValue(value, callback){
    chrome.storage.local.get(value, function (items){
        if(items[value] == null){ 
            callback(false);
        }else if(items[value]){ 
            callback(items[value]);
        }
    }); 
}

function unameAvailable(uname, callback){   
    var xmlhttp = new XMLHttpRequest();       
    xmlhttp.open("POST", "http://104.236.30.108:8000/unameRequest", true);
    var toSend = {"unameRequested":uname};
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.onreadystatechange = function() { //Call a function when the state changes.
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if(xmlhttp.responseText === "available"){
                callback(true);
            }else if(xmlhttp.responseText === "unavailable"){
                callback(false);
            }
        }
    }
    xmlhttp.send(JSON.stringify(toSend));
}

function userNameUnavailable(uname){
    document.getElementById("uname_taken_notification").innerHTML = "Please try another username.<br>'<b>" + uname + "</b>' is either <b>taken</b> or contains <b>forbidden characters</b>.";
}

function letSelectUsername(myID){
    console.log("in letSelectUsername");
    var usernamewrapper = document.getElementById("usernameWrapper");
    usernamewrapper.style = "display:block";
    document.getElementById("usernameSubmit").addEventListener('click', function(){
        var nameChosen = document.getElementById("usernameText").value;
        unameAvailable(nameChosen, function(available){
            if(available){
                console.log("username available for", myID);
                chrome.storage.local.set({"friendCastUsername": nameChosen});
                start(myID, nameChosen);
            }else if (!available){
                console.log("username NOT available for", myID);
                userNameUnavailable(nameChosen);
            }
        });
    })
}

// previously getID()
function init(){
    checkForValue('friendCastID', function(ID){
        var myID;
        if(!ID){
            myID = guid();
            chrome.storage.local.set({'friendCastID': myID});
        }else{
            myID = ID;
        }
        checkForValue('friendCastUsername', function(uname){
            if(!uname){
                letSelectUsername(myID);
            }else if(uname){
                username = uname;
                start(myID, uname);
            }
        });


    });
}

window.addEventListener("load", init);