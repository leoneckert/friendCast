function init(){
    document.getElementById("text").innerHTML = chrome.tabs; 


    // These help with cross-browser functionality (shim)
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    // The video element on the page to display the webcam
    var video = document.getElementById('thevideo');

    // if we have the method
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true, audio: true}, function(stream) {
            video.src = window.URL.createObjectURL(stream) || stream;
            video.play();
        }, function(error) {alert("Failure " + error.code);});
    }
       
}

window.addEventListener("load", init);