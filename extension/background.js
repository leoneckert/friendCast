

var askID = setInterval(function(){ 
    chrome.storage.local.get("friendCastID", function (items){
        if(items["friendCastID"] == null){ 
            console.log("no id found"); 
        }else if(items["friendCastID"]){ 
            console.log("USERNAME", items["friendCastID"]);
            myID = items["friendCastID"];

            clearInterval(askID);



            chrome.extension.onMessage.addListener(
                function(request, sender, sendResponse) {
                    // console.log(sender);
                    console.log(request);

                    if(request.type === "stream"){
                        console.log("it's astream!");
                        sendToAllTabs(request);
                    }
                }
            );


            

            var currentTabs = {};


            function sendToAllTabs(message){
                tabIDs = Object.keys(currentTabs);

                console.log(tabIDs);
                for(var i = 0; i < tabIDs.length; i++){
                    chrome.tabs.sendMessage(currentTabs[tabIDs[i]]["data"].id, message);
                }  
            }


            function initCurrentTabs(){
                chrome.windows.getAll(function(win){
                    for(var i = 0; i < win.length; i++){
                        chrome.tabs.getAllInWindow(win[i].id, function(tabs){
                            for(var j = 0; j < tabs.length; j++){
                                currentTabs[tabs[j].id] = {};
                                currentTabs[tabs[j].id]["data"] = tabs[j]
                            }
                        })
                    }
                });

                console.dir(currentTabs)
            }

            initCurrentTabs();


            

            // chrome.tabs.getAllInWindow(integer windowId, function callback)

            // chrome.tabs.onUpdated.addListener(function callback)

            // chrome.tabs.onCreated.addListener(function callback)

            // chrome.tabs.onRemoved.addListener(function callback)


        

        }
    }); 
}, 2000);



       