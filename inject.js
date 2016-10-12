function init(){

    
    function replaceLargestImg(){

        // document.body.innerHTML += '<div width="500px" height="200px">"hello"</div>'
        // search for biggest media (image) and get size
        var imgs = document.getElementsByTagName("img");
        console.log(imgs);
        var max_size = 0;
        var max_w = 0;
        var max_h = 0;
        var max_src = ""
        for(var i = 0; i < imgs.length; i++){
            // console.log(i, imgs[i].width, imgs[i].height);
            var product = imgs[i].width * imgs[i].height;
            console.log(i, "   ->", product);
            console.log(imgs[i].currentSrc);
            console.log(imgs[i].currentSrc.length);


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
        newChild.style = "background-color: black; width:"+String(max_w)+"px; height:"+String(max_h)+"px;"

        max_img_tag.parentNode.replaceChild(newChild, max_img_tag);

    }


}

window.addEventListener("load", init);