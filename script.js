let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let x = 0;

let loadImage = (src, callback) => {
    let img = document.createElement("img");
    img.onload = () => callback(img);
    img.src = src;
};

let imagePath = (frameNumber, animation) => {
        return "images/" + animation + "/" + frameNumber + ".png";
};

let frames = {
    idle: [1, 2, 3, 4, 5, 6, 7, 8],
    kick: [1, 2, 3, 4, 5, 6, 7],
    punch: [1, 2, 3, 4, 5, 6, 7],
    block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    forward: [1, 2, 3, 4, 5, 6],
    backward: [1, 2, 3, 4, 5, 6],
};

let loadImages = (callback) => {
    let images = {idle: [], kick:[], punch: [], block: [], forward: [], backward: [] };
    let imagesToLoad = 0;

    ["idle", "kick", "punch", "block", "forward", "backward"].forEach((animation) => {
        let animationFrames = frames[animation];
        imagesToLoad = imagesToLoad + animationFrames.length;

        animationFrames.forEach((frameNumber) =>{

            let path = imagePath(frameNumber, animation);

            loadImage(path, (image)=>{
                images[animation][frameNumber - 1] = image;
                imagesToLoad = imagesToLoad - 1;

                if (imagesToLoad === 0) {
                    callback(images);
                }
            });
        });
    });
};

let animate = (ctx, images, animation, callback) => {
    images[animation].forEach((image, index) => {
        setTimeout(() => {
            ctx.clearRect(x, 0, c.width, c.height);
            ctx.drawImage(image, x, 0, 800, 800);
        }, index * 100);
    });

    setTimeout(callback, images[animation].length * 100);

    if(animation == "forward" && x < 1600){
        x += 100;
    }else if(animation == "backward" && x > 0){
        x -= 100;
    }
};

loadImages((images) => {
    let queuedAnimations = [];
    
    let aux = () =>{
        let selectedAnimation;

        if (queuedAnimations.length === 0){
            selectedAnimation = "idle"
        }else{
            selectedAnimation = queuedAnimations.shift();
        }
        animate(ctx, images, selectedAnimation, aux); 
    };

    aux();
     
    document.getElementById("kick").onclick = () => {
        queuedAnimations.push("kick");
    };

    document.getElementById("punch").onclick = () => {
        queuedAnimations.push("punch");
    };

    document.getElementById("block").onclick = () => {
        queuedAnimations.push("block");
    };

    document.getElementById("forward").onclick = () => {
        queuedAnimations.push("forward");
    };

    document.getElementById("backward").onclick = () => {
        queuedAnimations.push("backward");
    };

    document.addEventListener('keyup', (event) => {
        //const key = event.key;

        if (event.code === "ArrowDown") {
            queuedAnimations.push("kick");
        }else if(event.code === "ArrowUp") {
            queuedAnimations.push("punch");
        }else if(event.code === "ArrowRight") {
            queuedAnimations.push("forward");
        }else if(event.code === "ArrowLeft") {
            queuedAnimations.push("backward");
        }else if(event.code === "Space") {
            queuedAnimations.push("block");
        }
      });
});
