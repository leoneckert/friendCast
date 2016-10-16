
function init(){
    /* Get User Media */
    var my_stream = null;

    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true, audio: true}, function(stream) {
                my_stream = stream;
                var videoElement = document.getElementById('myvideo');
                videoElement.src = window.URL.createObjectURL(stream) || stream;
                videoElement.play();
            }, function(err) {
                console.log('Failed to get local stream' ,err);
        });
    }





    
}




window.addEventListener("load", init);