function init(){

    console.log("injected");

    // function isHTTPS(string){
    //     if (string.substring(0, 5) == "https") {
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }

    // function replaceLargestImg(callback){
    //     var imgs = document.getElementsByTagName("img");
    //     var max_size = 0;
    //     var max_w = 0;
    //     var max_h = 0;
    //     var max_src = ""
    //     for(var i = 0; i < imgs.length; i++){
    //         var product = imgs[i].width * imgs[i].height;
    //         if(product > max_size && imgs[i].currentSrc.length > 10){
    //             max_size = product;
    //             max_w = imgs[i].width;
    //             max_h = imgs[i].height;
    //             max_img_tag = imgs[i];
    //         }
    //     }
    //     var newChild = document.createElement('div');
    //     newChild.id = "throughthenewsWrapper";
    //     newChild.style = "background-color: black; width:"+String(max_w)+"px; height:"+String(max_h)+"px; text-align:center; overflow:hidden"
    //     max_img_tag.parentNode.replaceChild(newChild, max_img_tag);
    //     callback(newChild, max_w, max_h);
    // }



    // if(isHTTPS(window.location.origin)){
    //     alert("THIS IS HTTPS!")
    //     replaceLargestImg(function(container, c_width, c_height){
    //         alert("GOT THE IMAGE");

    //         // chrome.runtime.onMessage.addListener(
    //         //   function(message, sender, sendResponse) {
    //         //     console.log(message.greeting);
    //         //     sendResponse({farewell: "goodbye"});
    //         //   });

    //     });
    // }

}

window.addEventListener("load", init);