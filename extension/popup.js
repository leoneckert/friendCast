window.addEventListener("load", init(function(myID, username){

    function toServer(postkey, data, callback){   
        var xmlhttp = new XMLHttpRequest();       
        xmlhttp.open("POST", "http://104.236.30.108:8000/"+postkey, true);
        var toSend = {"id":myID, "data":data};
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.onreadystatechange = function() {//Call a function when the state changes.
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                callback(xmlhttp.responseText);
            }
        }
        xmlhttp.send(JSON.stringify(toSend));
    }


    toServer("hello", {}, function(_){ // makes sure the ID is on the server
        
        if(username === ""){
            letSelectUsername(function(chosenName){
                console.log("USER wants to be known as", chosenName);
                toServer("username_req", {"uname":chosenName}, function(resp){
                    
                });
            });  
        }

    });  

    

    

    // chrome.tabs.query({}, function(tabs) {
    //     for (var i=0; i<tabs.length; i++) {
    //         chrome.tabs.sendMessage(tabs[i].id, "some message");
    //     }
    // });

    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    
    //     for (var i=0; i<tabs.length; i++) {
    //         // chrome.tabs.sendMessage(tabs[i].id, "some message");

    //         chrome.tabs.sendMessage(tabs[i].id, {greeting: "hello"}, function(response) {
    //             console.log(response.farewell);
    //         });
    //     }
    // });


    // getID(function(myID){
    //     console.log("in getID() with an ID available:", myID);

    // });

    

}));







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

function letSelectUsername(callback){
    var usernamewrapper = document.getElementById("usernameWrapper");
    usernamewrapper.style = "display:block";
    document.getElementById("usernameSubmit").addEventListener('click', function(){
        var nameChosen = document.getElementById("usernameText").value;
        callback(nameChosen);
    })
}

// previously getID()
function init(callback){
    checkForValue('uniqueKey', function(ID){
        var myID;
        if(!ID){
            myID = guid();
            chrome.storage.local.set({'uniqueKey': myID});
        }else{
            myID = ID;
        }
        checkForValue('username', function(uname){
            var username = "";
            if(uname){
                username = uname;
            }
            // letSelectUsername();
            callback(myID, username);
        });
    });
}