function init(){
    console.log("injected");
    

    if(isHTTPS(window.location.origin)){

        sendToBackground( {header: "iAmHTTPS"} , function(response){
            console.log(response);
            var peerID = response.peerID;
            var caller = response.caller; 

            replaceLargestImg(function(originalImg, replaceWrapper, c_width, c_height){
                alert("GOT THE IMAGE");
                console.log("peerID", peerID);
                console.log("caller", caller);
                

                var peer = new Peer(peerID, {host: 'liveweb.itp.io', port: 9000, path: '/'});
                console.log("connected", peerID);


                function makeCall(friend){
                    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                    if (navigator.getUserMedia) {
                        navigator.getUserMedia({video: true, audio: true}, function(stream) {
                                my_stream = stream;
                                var call = peer.call(friend, my_stream);
                            }, function(err) {
                                console.log('Failed to get local stream' ,err);
                        });
                    }
                }

                peer.on('error', function(err) {
                    console.log(err);
                });

                peer.on('call', function(incoming_call) {
                    console.log("Got a call!");
                    console.log(incoming_call);
                    
                    incoming_call.answer(); // Answer the call with our stream from getUserMedia
                    
                    incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
                        
                        // And attach it to a video object
                        var ovideoElement = document.createElement("video");
                        // document.getElementById('othervideo');
                        ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
                        ovideoElement.setAttribute("autoplay", "true"); 
                        ovideoElement.id = "friendCastVideo"
                        // ovideoElement.muted = muted;     
                        ovideoElement.play();
                                        

                        originalImg.parentNode.replaceChild(replaceWrapper, originalImg);
                        replaceWrapper.appendChild(ovideoElement);
                    });
                });

                chrome.runtime.onMessage.addListener(
                    function(request, sender, sendResponse) {
                        console.log(sender);
                        console.log(request);

                        if(request.message == "currentCalls"){
                            //check who am i calling already
                            var peopleToCall = Object.keys(request.data);
                            for(var i = 0; i< peopleToCall.length; i++){
                                console.log("Calling", peopleToCall[i]);
                                var peerIDbase = request.data[peopleToCall[i]]["FCpeerID"];
                                console.log("peerIDbase", peerIDbase);
                                var allExtensions = request.data[peopleToCall[i]]["FCextensions"];
                                for (var j = 0; j < allExtensions.length; j++){
                                    console.log(peerIDbase+"-"+allExtensions[j]);
                                    var number = peerIDbase+"-"+allExtensions[j];
                                    makeCall(number);
                                }

                            }

                        }

                        // {"message": "currentCalls", "data": currentlyCalling}
                        // if(request["message"] == "unmute"){
                        //     console.log("unmuting!");
                        //     document.getElementById("friendCastVideo").muted = false;
                        // }
                    }
                );


            });




        });



        // });
    }



}

function sendToBackground(message, callback){
    chrome.runtime.sendMessage(message, function(res){
        if(callback){
            callback(res);
        }
    });
}


function isHTTPS(string){
    if (string.substring(0, 5) == "https") {
        return true;
    }else{
        return false;
    }
}


window.addEventListener("load", init);


function replaceLargestImg(callback){
    var imgs = document.getElementsByTagName("img");
    var max_size = 0;
    var max_w = 0;
    var max_h = 0;
    var max_src = ""
    for(var i = 0; i < imgs.length; i++){
        var product = imgs[i].width * imgs[i].height;
        if(product > max_size && imgs[i].currentSrc.length > 10){
            max_size = product;
            max_w = imgs[i].width;
            max_h = imgs[i].height;
            max_img_tag = imgs[i];
        }
    }
    var newChild = document.createElement('div');
    newChild.id = "throughthenewsWrapper";
    newChild.style = "background-color: black; width:"+String(max_w)+"px; height:"+String(max_h)+"px; text-align:center; overflow:hidden"
    // max_img_tag.parentNode.replaceChild(newChild, max_img_tag);
    callback(max_img_tag, newChild, max_w, max_h);
}



// function init(){

//     var myID = null;

//     console.log("injected");

//     function isHTTPS(string){
//         if (string.substring(0, 5) == "https") {
//             return true;
//         }else{
//             return false;
//         }
//     }

//     function replaceLargestImg(callback){
//         var imgs = document.getElementsByTagName("img");
//         var max_size = 0;
//         var max_w = 0;
//         var max_h = 0;
//         var max_src = ""
//         for(var i = 0; i < imgs.length; i++){
//             var product = imgs[i].width * imgs[i].height;
//             if(product > max_size && imgs[i].currentSrc.length > 10){
//                 max_size = product;
//                 max_w = imgs[i].width;
//                 max_h = imgs[i].height;
//                 max_img_tag = imgs[i];
//             }
//         }
//         var newChild = document.createElement('div');
//         newChild.id = "throughthenewsWrapper";
//         newChild.style = "background-color: black; width:"+String(max_w)+"px; height:"+String(max_h)+"px; text-align:center; overflow:hidden"
//         // max_img_tag.parentNode.replaceChild(newChild, max_img_tag);
//         callback(max_img_tag, newChild, max_w, max_h);
//     }

    
//     function sendToBackground(message, callback){
//         chrome.runtime.sendMessage(message, function(res){
//             if(callback){
//                 callback(res);
//             }
//         });
//     }




//     // if https, say hello to background.js
//     if(isHTTPS(window.location.origin)){

//         sendToBackground( {"type": "iAmHTTPS"} , function(myPeerID){
//             console.log(myPeerID);
//             var peerID = myPeerID["peerID"];
//             var muted = myPeerID["muted"];
//             console.log("muted", muted);



//             replaceLargestImg(function(originalImg, replaceWrapper, c_width, c_height){
//                 alert("GOT THE IMAGE");
                

//                 var peer = new Peer(peerID, {host: 'liveweb.itp.io', port: 9000, path: '/'});
//                 console.log("connected", peerID);

//                 peer.on('error', function(err) {
//                     console.log(err);
//                 });

//                 peer.on('call', function(incoming_call) {
//                     console.log("Got a call!");
//                     console.log(incoming_call);
                    
//                     incoming_call.answer(); // Answer the call with our stream from getUserMedia
                    
//                     incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
                        
//                         // And attach it to a video object
//                         var ovideoElement = document.createElement("video");

//                         // document.getElementById('othervideo');
//                         ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
//                         ovideoElement.setAttribute("autoplay", "true"); 
//                         ovideoElement.id = "friendCastVideo"
//                         ovideoElement.muted = muted;     
//                         ovideoElement.play();
                                        

//                         originalImg.parentNode.replaceChild(replaceWrapper, originalImg);
//                         replaceWrapper.appendChild(ovideoElement);
                                                        
                    
//                     });
//                 });

//                 chrome.runtime.onMessage.addListener(
//                     function(request, sender, sendResponse) {
//                         console.log(sender);
//                         console.log(request);

//                         if(request["message"] == "unmute"){
//                             console.log("unmuting!");
//                             document.getElementById("friendCastVideo").muted = false;
//                         }
//                     }
//                 );


//             });




//         });



//     }






// }

// window.addEventListener("load", init);