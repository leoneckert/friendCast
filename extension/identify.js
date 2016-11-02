var askFCsecretID  = setInterval(function(){ 
    chrome.storage.local.get("FCsecretID", function (items){
        if(items["FCsecretID"] == null){ 
            console.log("no FCsecretID found"); 
        }else if(items["FCsecretID"]){ 
            var FCsecretID = items["FCsecretID"];
            var askFCpeerID = setInterval(function(){ 
                chrome.storage.local.get("FCpeerID", function (items){
                    if(items["FCpeerID"] == null){ 
                        console.log("no FCpeerID found"); 
                    }else if(items["FCpeerID"]){ 
                        var FCpeerID = items["FCpeerID"];
                        var askFCusername = setInterval(function(){ 
                            chrome.storage.local.get("FCusername", function (items){
                                if(items["FCusername"] == null){ 
                                    console.log("no FCusername found"); 
                                }else if(items["FCusername"]){ 
                                    var FCusername = items["FCusername"];


                                    runBackground(FCsecretID, FCpeerID, FCusername);


                                    clearInterval(askFCusername);
                                }
                            });
                        }, 2000);
                        clearInterval(askFCpeerID);
                    }
                });
            }, 2000);
            clearInterval(askFCsecretID);
        }
    });
}, 2000);