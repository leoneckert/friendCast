function init(){

    var myID = null;

    console.log("injected");

    function isHTTPS(string){
        if (string.substring(0, 5) == "https") {
            return true;
        }else{
            return false;
        }
    }

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

    


    
    var askID = setInterval(function(){ 
        chrome.storage.local.get("friendCastID", function (items){
            if(items["friendCastID"] == null){ 
                console.log("no id found"); 
            }else if(items["friendCastID"]){ 
                console.log("USERNAME", items["friendCastID"]);
                myID = items["friendCastID"];
                clearInterval(askID);

                replaceLargestImg(function(originalImg, replaceWrapper, c_width, c_height){
                    alert("GOT THE IMAGE");

                    // chrome.runtime.onMessage.addListener(
                    //     function(request, sender, sendResponse) {
                    //         console.log(sender);
                    //         console.log(request);

                    //         if(request.type === "stream"){
                    //             console.log("it's astream!");

                    //             // And attach it to a video object
                    //             var ovideoElement = document.createElement("video");

                    //             // document.getElementById('othervideo');
                    //             // ovideoElement.src = request.streamSource
                    //             ovideoElement.src = window.URL.createObjectURL(request.stream) || request.stream;
                    //             ovideoElement.setAttribute("autoplay", "true");     
                    //             ovideoElement.play();

                    //             originalImg.parentNode.replaceChild(replaceWrapper, originalImg);
                    //             replaceWrapper.appendChild(ovideoElement);
                    //         }
                    //     }
                    // );

                    
                


                    if(isHTTPS(window.location.origin)){

                        alert("THIS IS HTTPS!");
                        
                        var peer = new Peer(myID, {host: 'liveweb.itp.io', port: 9000, path: '/'});

                        peer.on('error', function(err) {
                            console.log(err);
                        });

                        peer.on('call', function(incoming_call) {
                            console.log("Got a call!");
                            console.log(incoming_call);
                            
                            incoming_call.answer(); // Answer the call with our stream from getUserMedia
                            
                            incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
                                

                                // var theSource = window.URL.createObjectURL(remoteStream) || remoteStream;
                                // chrome.runtime.sendMessage({"type": "stream", info: incoming_call.peer, "streamSource": theSource, "stream": remoteStream});


                                
                                // And attach it to a video object
                                var ovideoElement = document.createElement("video");

                                // document.getElementById('othervideo');
                                ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
                                ovideoElement.setAttribute("autoplay", "true");     
                                ovideoElement.play();
                                                

                                originalImg.parentNode.replaceChild(replaceWrapper, originalImg);
                                replaceWrapper.appendChild(ovideoElement);
                                                                
                                

                            });
                        });
                      

                    }

                });
            }
        }); 
    }, 4000);


}

window.addEventListener("load", init);