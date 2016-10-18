function runBackground(FCsecretID, FCpeerID, FCusername){
    console.log("in runBackground with FCsecretID, FCpeerID, FCusername", FCsecretID, FCpeerID, FCusername);


    var FCfriends = {};
    var currentlyCalling = [];
    var currentTabs = {};
    var extensions = [];

    var sendExtensionCountdown = false;

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

    function updateExtensionsThereAndFCfriendsHere(){
        toServer("updateFriends", {"extensions": extensions}, function(response){
            var res = JSON.parse(response);
            if(res["status"] === "success"){
               FCfriends = res["FCfriends"];
               console.log("updated FCfriends");
               console.dir(FCfriends); 
            }
        });
    }

    var updateFCfriendsRegularly = setInterval(function(){ 
        updateExtensionsThereAndFCfriendsHere();
    }, 300000);


    function sendExtensionsToServer(){
        //only sending Extensions every 5 seconds max
        if(!sendExtensionCountdown){
            sendExtensionCountdown = true;
            setTimeout(function(){ 
                toServer("extensions", {"extensions": extensions});
                sendExtensionCountdown = false;
            }, 5000);
        }
    }

    function addExtension(toAdd, callback){
        var exists = false
        for(var i = 0; i < extensions.length; i++){
            if(extensions[i] == toAdd) exists = true;
        }

        if(!exists){
            console.log("Adding extension:", toAdd);
            extensions.push(String(toAdd));
            // sendExtensionsToServer();
        }
        callback();

    }

    function deleteExtension(toDelete, callback){
        var index = extensions.indexOf(toDelete);
        if (index > -1) {
            extensions.splice(index, 1);
        }
        callback();
    }

    function deleteTab(tabID){
        console.log("deleting tab", tabID);
        delete currentTabs[tabID];
        deleteExtension(tabID, function(){
            sendExtensionsToServer();
        });
       
    } 

    chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(request);
            console.log(sender);
            // console.log(request);
            if(request.header == "friendUpdate"){
                FCfriends = request.friends;
                console.log("updated FCfriends");
                console.dir(FCfriends);
            }else if(request.header == "iAmHTTPS"){
                    
                var tabName = String(sender.tab.id);
                var tabId = sender.tab.id;

                if (currentTabs[tabName]) {
                    deleteTab(tabName);
                }
                currentTabs[tabName] = {};
                currentTabs[tabName]["data"] = sender.tab;
                currentTabs[tabName]["id"] = tabId;
                addExtension(tabName, function(){
                    sendExtensionsToServer();
                });

            }else if(request.header == "call"){
                    
                
            }
        }
    );

    chrome.tabs.onRemoved.addListener(
        function(idOfTab, removeInfo){
            deleteTab(String(idOfTab));
        }
    );





}







// var askID = setInterval(function(){ 
//     chrome.storage.local.get("friendCastID", function (items){
//         if(items["friendCastID"] == null){ 
//             console.log("no id found"); 
//         }else if(items["friendCastID"]){ 
//             console.log("ID", items["friendCastID"]);
//             myID = items["friendCastID"];

//             // function toServer(postkey, data, callback){   
//             //     var xmlhttp = new XMLHttpRequest();       
//             //     xmlhttp.open("POST", "http://104.236.30.108:8000/"+postkey, true);
//             //     var toSend = {"id":myID, "data":data};
//             //     xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//             //     xmlhttp.onreadystatechange = function() {//Call a function when the state changes.
//             //         if(xmlhttp.readyState == 4 && xmlhttp.status == 200 && callback) {
//             //             callback(xmlhttp.responseText);
//             //         }
//             //     }
//             //     xmlhttp.send(JSON.stringify(toSend));
//             // }


//             clearInterval(askID);


//             var currentTabs = {};
//             var extensions = [];

            

//             chrome.extension.onMessage.addListener(
//                 function(request, sender, sendResponse) {

//                     if(request.type == "iAmHTTPS"){
//                         var tabID = String(sender.tab.id);
//                         console.log("a https");
//                         var tabsPeerID = myID+"-"+String(sender.tab.id);
//                         if (currentTabs[sender.tab.id]) {
//                             deleteTab(tabID);
//                         }

//                         var muted = null;
//                         if(Object.keys(currentTabs).length === 0) muted = false;
//                         else muted = true;
                        
//                         console.log("construcintg tab id");
//                         currentTabs[tabID] = {};
//                         currentTabs[tabID]["data"] = sender.tab;
//                         currentTabs[tabID]["muted"] = muted;
//                         // addExtension(tabID)
                        
//                         console.dir(currentTabs);
//                         sendResponse({"peerID": tabsPeerID, "muted": currentTabs[tabID]["muted"]});




//                     }
//                 }
//             );

//             // function sendExtensionsToServer(){
//             //     toServer("extensions", {"extensions": extensions});
//             // }

//             // function addExtension(toAdd){
//             //     var exists = false
//             //     for(var i = 0; i < extensions.length; i++){
//             //         if(extensions[i] == toAdd){
//             //             exists = true;
//             //         }
//             //     }
//             //     if(!exists){
//             //         console.log("Adding extension:", toAdd);
//             //         extensions.push(String(toAdd));
//             //         sendExtensionsToServer();
//             //     }
//             // }
//             function deleteExtension(toDelete){
//                 var index = extensions.indexOf(toDelete);
//                 if (index > -1) {
//                     extensions.splice(index, 1);
//                 }
//             }

//             function deleteTab(id){
//                 console.log("deleting tab", id);
//                 var tabID = String(id);

//                 if(currentTabs[tabID]){
//                     var reAssignMuted = false;
//                     //check if the tab was muted

//                     if(currentTabs[tabID]["muted"] === false && Object.keys(currentTabs).length != 1){
//                         console.log("muted tab closing! Re-assign!");
//                         reAssignMuted = true;
//                     }
//                     // delete tab
//                     delete currentTabs[tabID];
//                     deleteExtension(tabID);
//                     // reassign muted
//                     if(reAssignMuted){
//                         activeTabs = Object.keys(currentTabs);

//                         chrome.tabs.sendMessage(parseInt(activeTabs[0]), {"message": "unmute"});

//                     }
                    
//                     // tell server that tab is closed

//                 }

//             }   

//             chrome.tabs.onRemoved.addListener(
//                 function(idOfTab, removeInfo){
                    
//                     deleteTab(idOfTab);

//                 }
//             );


//             //refresh is handled,
//             //update only needs to take place when video dissappears...
//             // chrome.tabs.onUpdated.addListener(
//                 // function(idOfTab, changeInfo, tab){

//                 //     console.log("updated tab");
//                 //     console.log(idOfTab);
//                 //     // console.log(changeInfo);
//                 //     // console.log(tab);
//                 //     var tabID = String(idOfTab);
//                 //     if(currentTabs[tabID]["data"].url != tab.url){
//                 //         console.log("UURL CHANGED!!!")
//                 //     }
//                 // }
//             // );

            
            

//             // var currentTabs = {};


//             // function sendToAllTabs(message){
//             //     tabIDs = Object.keys(currentTabs);

//             //     console.log(tabIDs);
//             //     for(var i = 0; i < tabIDs.length; i++){
//             //         chrome.tabs.sendMessage(currentTabs[tabIDs[i]]["data"].id, message);
//             //     }  
//             // }


//             // function initCurrentTabs(){
//             //     chrome.windows.getAll(function(win){
//             //         for(var i = 0; i < win.length; i++){
//             //             chrome.tabs.getAllInWindow(win[i].id, function(tabs){
//             //                 for(var j = 0; j < tabs.length; j++){
//             //                     currentTabs[tabs[j].id] = {};
//             //                     currentTabs[tabs[j].id]["data"] = tabs[j]
//             //                 }
//             //             })
//             //         }
//             //     });

//             //     console.dir(currentTabs)
//             // }

//             // initCurrentTabs();


            

//             // chrome.tabs.getAllInWindow(integer windowId, function callback)

//             // chrome.tabs.onUpdated.addListener(function callback)

//             // chrome.tabs.onCreated.addListener(function callback)

//             // chrome.tabs.onRemoved.addListener(function callback)


        

//         }
//     }); 
// }, 2000);



//        