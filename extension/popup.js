function start(FCsecretID, FCpeerID, FCusername){

    console.log("in popup.js");
    console.log("FCsecretID", FCsecretID);
    console.log("FCpeerID", FCpeerID);
    console.log("FCusername", FCusername);

    var FCfriends = {"pending": [], "confirmed": {}};

    function toServer(postkey, data, callback){   
        var xmlhttp = new XMLHttpRequest();       
        xmlhttp.open("POST", "http://104.236.30.108:8000/"+postkey, true);
        var toSend = {"FCsecretID":FCsecretID, "FCpeerID": FCpeerID, "FCusername": FCusername, "data":data};
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.onreadystatechange = function() {//Call a function when the state changes.
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200 && callback) {
                callback(xmlhttp.responseText);
            }
        }
        xmlhttp.send(JSON.stringify(toSend));
    }

    function addFriend(){
        document.getElementById("friend_not_exist_notification").innerHTML = "";
        var friendToAdd = document.getElementById("friendText").value;
        console.log(username,"wants to add", friendToAdd,"as a friend.");
        toServer("addfriend", {"name": friendToAdd}, function(response){
            var res = JSON.parse(response);
            
            if(res["status"] === "pending"){
                friends["pending"].push(friendToAdd);
            }else if(res["status"] === "friends"){
                friends["confirmed"][friendToAdd] = res["friendID"];
            }
            renderPopup();
            
            if(res["status"] === "unavailable"){
                document.getElementById("friend_not_exist_notification").innerHTML = "<b>"+friendToAdd+"</b> could not be found.";
            }
        })
    }

    function sendStream(recipient) {   
        chrome.runtime.sendMessage({"myID": myID, "nameToCall": recipient, "idToCall": friends["confirmed"][recipient]});
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
                
                var friendListing = document.createElement("p");
                friendListing.innerHTML = ">> "+confirmed[i]+" ";

                var callButton = document.createElement("a");
                callButton.innerHTML = "go live";
                callButton.href = "#";
                callButton.id = confirmed[i];
                callButton.addEventListener('click', function(){
                    sendStream(this.id);
                })

                friendListing.appendChild(callButton);
                confirmedFriends.appendChild(friendListing);
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
        // console.log("GOT MY FRIEND OBJ");
        console.dir(response);
        FCfriends = JSON.parse(response);
        console.dir(FCfriends);
        renderPopup();
    });


     
}




