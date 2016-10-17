
function init(){
    /* Get User Media */
    var my_stream = null;





    var button = document.getElementById("submit");
    button.addEventListener("click", assignPeerID);

    function getName(callback){
        var name = document.getElementById("name").value;
        callback(name);
    }

    function assignPeerID(){
        getName(function(name){
            console.log(name);

            // We'll use a global variable to hold on to our id from PeerJS
            var peer_id = null;

            // Register for an API Key: http://peerjs.com/peerserver
            //var peer = new Peer({key: 'YOUR API KEY'});
            // The Peer Cloud Server doesn't seem to be operational, I setup a server on a Digital Ocean instance for our use, you can use that with the following constructor:
            var peer = new Peer(name, {host: 'liveweb.itp.io', port: 9000, path: '/'});

            // Get an ID from the PeerJS server     
            // peer.on('open', function(id) {
            //   console.log('My peer ID is: ' + id);
            //   peer_id = id;
            // });

            peer.on('error', function(err) {
              console.log(err);
            });

            peer.on('call', function(incoming_call) {
                console.log("Got a call!");
                console.log(incoming_call);
                incoming_call.answer(); // Answer the call with our stream from getUserMedia
                incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
                    // And attach it to a video object
                    var ovideoElement = document.getElementById('othervideo');
                    ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
                    ovideoElement.setAttribute("autoplay", "true");     
                    ovideoElement.play();
                });
            });


            var phone = document.getElementById("call");
            phone.addEventListener("click", makeCall);


            function getNumber(callback){
                var name = document.getElementById("friend").value;
                callback(name);
            }

            function makeCall(){

                getNumber(function(friend){


                    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                    if (navigator.getUserMedia) {
                        navigator.getUserMedia({video: true, audio: true}, function(stream) {
                                my_stream = stream;
                                // var videoElement = document.getElementById('myvideo');
                                // videoElement.src = window.URL.createObjectURL(stream) || stream;
                                // videoElement.play();




                                var call = peer.call(friend, my_stream);
                                // call.on('stream', function(remoteStream) {
                                // // Show stream in some video/canvas element.
                                //     var ovideoElement = document.getElementById('othervideo');
                                //     ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
                                //     ovideoElement.setAttribute("autoplay", "true");     
                                //     ovideoElement.play();
                                // });




                                
                            }, function(err) {
                                console.log('Failed to get local stream' ,err);
                        });
                    }


                });

               
            }




        });
    }



    
}




window.addEventListener("load", init);