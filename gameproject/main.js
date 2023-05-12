

let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width=400;
canvas.height=700;

document.body.appendChild(canvas);  // 자식으로 붙여준다 

let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;

//우주선 좌표
let spaceshipX = canvas.width/2-32
let spaceshipY = canvas.height-64

function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src="../images/background.png";

    gameOverImage = new Image();
    gameOverImage.src="images/gameoverimg.jpg";

    bulletImage = new Image();
    bulletImage.src="images/bullet.png";

    spaceshipImage = new Image();
    spaceshipImage.src="../images/spaceship.png";

    gameOverImage = new Image();
    gameOverImage.src="images/gameover.jpg";
    
}

// function setupKeyboardListener() {
//     document.addEventListener("keydown",function(event) {
//         console.log("무슨 키가 눌렸어?", event)
//     })
// }


function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
}

function main() {
    render();
    requestAnimationFrame(main);
    
}

loadImage();
main();
