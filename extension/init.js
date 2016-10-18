
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

function letSelectUsername(FCsecretID, FCpeerID){
    var usernamewrapper = document.getElementById("usernameWrapper");
    usernamewrapper.style = "display:block";
    document.getElementById("usernameSubmit").addEventListener('click', function(){
        var nameChosen = document.getElementById("usernameText").value;
        unameAvailable(nameChosen, function(available){
            if(available){
                console.log("username available for", FCsecretID);
                chrome.storage.local.set({"FCusername": nameChosen});
                start(FCsecretID, FCpeerID, nameChosen);
            }else if (!available){
                console.log("username NOT available for", FCsecretID);
                userNameUnavailable(nameChosen);
            }
        });
    })
}

// previously getID()
function init(){

    checkForValue('FCsecretID', function(ID){
        var FCsecretID;
        if(!ID){
            FCsecretID = guid();
            chrome.storage.local.set({'FCsecretID': FCsecretID});
        }else{
            FCsecretID = ID;
        }
        checkForValue('FCpeerID', function(ID){
            var FCpeerID;
            if(!ID){
                FCpeerID = guid();
                chrome.storage.local.set({'FCpeerID': FCpeerID});
            }else{
                FCpeerID = ID;
            }
            checkForValue('FCusername', function(uname){
                var FCusername;
                if(!uname){
                    letSelectUsername(FCsecretID, FCpeerID);
                }else if(uname){
                    FCusername = uname;
                    start(FCsecretID, FCpeerID, FCusername);
                }
            });
        
        });


    });
}

window.addEventListener("load", init);