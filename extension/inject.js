function init(){

    
    function replaceLargestImg(callback){
        var imgs = document.getElementsByTagName("img");
        console.log(imgs);
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

        console.log(max_size);
        console.log(max_w, max_h);
        console.log(max_img_tag);
        console.log(max_img_tag.parentNode);
        
        var newChild = document.createElement('div');
        newChild.id = "throughthenewsWrapper";
        newChild.style = "background-color: black; width:"+String(max_w)+"px; height:"+String(max_h)+"px; text-align:center; overflow:hidden"

        max_img_tag.parentNode.replaceChild(newChild, max_img_tag);

        callback(newChild, max_w, max_h);
    }

    replaceLargestImg(function(container, c_width, c_height){
        console.log("THE CONTAINER", container);


        var video = document.createElement('video');
        video.id = "thevideo";
        // video.src = "http://files.leoneckert.com/testvid.mov";
        video.style = "height:"+String(c_height)+"px; margin-left:-150px";
        video.muted = true;

        container.appendChild(video);

        // video.play();

          
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






    });

}

window.addEventListener("load", init);