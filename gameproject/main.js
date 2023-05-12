

let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width=400;
canvas.height=700;

document.body.appendChild(canvas);  // 자식으로 붙여준다 

let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;
let gameOver=false  // true이면 게임이 끝남, false이면 게임이 안끝남
let score = 0;
//우주선 좌표
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;

let bulletList = [] // 총알 저장하는 리스트
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = spaceshipX;
        this.y = spaceshipY;
        this.alive = true // true면 살아있는 총알 false면 죽은 총어ㅏㄹ
        bulletList.push(this);
    };

    //총알 발사는 y좌표값이 줄어든다는거
    this.update = function () {
        this.y -= 15;
};
}

this.checkHit = function() {
    for(let i = 0; enemyList.length; i++) {
        if(
            this.y <= enemyList[i].y &&
            this.x>=enemyList[i].x && 
            this.x <= enemyList[i].x+40
            ) {
            // 총알과 적 우주선이 닿으면 사라지고 점수 획득
            score++;
            this.alive = false // 죽은 총알 
            enemyList.splice(i, 1);
        }
    }
};


function generateRandomValue(min,max) {
    let randomNum = Math.random()*(max-min+1)
    return randomNum;
}
// 적군 저장하는 리스트 
let enemyList = []
function Enemy(){
    this.x=0;
    this.y=0;
    this.init =function(){
        this.y=0
        this.x=generateRandomValue(0,canvas.width-48)
        enemyList.push(this);
    }
    //적군의 속도 조절
    this.update=function(){
        this.y += 3;

        if(this.y >= canvas.height - 60){
            gameOver = true;
            
        }
    }
}

function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src="../images/background.png";

    gameOverImage = new Image();
    gameOverImage.src="../images/gameoverimg.jpg";

    bulletImage = new Image();
    bulletImage.src="../images/bullet.png";

    spaceshipImage = new Image();
    spaceshipImage.src="../images/spaceship.png";

    gameOverImage = new Image();
    gameOverImage.src="../images/gameover.jpg";

    enemyImage = new Image();
    enemyImage.src="../images/enemy.png";
    
}

let keysdown={};
function setupKeyboardListener() {
    document.addEventListener("keydown",function(event) {
        keysdown[event.key] = true;
        console.log("키값",keysdown);
    });
    document.addEventListener("keyup", function (event) {
        delete keysdown[event.key];

        if ( ' ' in keysdown) {
            createBullet();
        }
    });
}

function createEnemy() {
    const interval = setInterval(function() {
        let e = new Enemy();
        e.init()
    },1000)
}

function createBullet() {
    const interval = setInterval(function() {
    let b = new Bullet(); // 총알 하나 생성
    b.init()
    },500)
    console.log('총알생성',bulletList)
}


function update() {
    if ( 'ArrowRight' in keysdown) {
        spaceshipX += 5;   // 우주선 속도
    }  // 오른쪽이동
    if ( 'ArrowLeft' in keysdown) {
        spaceshipX -= 5;
    }

    if(spaceshipX <= 0) {
        spaceshipX=0
    }

    if(spaceshipX >= canvas.width-60) {
        spaceshipX = canvas.width-60;
    }
    // 우주선이 맵 밖으로 나가지 않게 하기 위해서

    // 총알의 y좌표 업데이트 하는 함수 호출 

    // 총알이 여러개니 
    //bulletList안에 있는 것들은 update를 계속 호출함 update는 메인에 있으니
    // update는 계속 -7씩하게됨
    for(let i = 0; i < bulletList.length; i++) {
        if(bulletList[i].alive){

      
        bulletList[i].update()
 //       bulletList[i].checkHit();
    }
    }
    for(let i=0; i<enemyList.length; i++) {
        enemyList[i].update();
    }
}

function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText(`score:${score}`, 20, 20);
    ctx.fillstyle = "white";
    ctx.font = "20px Arial";  


    for(let i = 0; i <bulletList.length; i++) {
        if ( bulletList[i].alive) { 
        ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
        }
    }
    for(let i = 0; i< enemyList.length; i++) {
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
    }
}

function main() {
    if(!gameOver) {
    update(); // 좌표값을 업데이트하고
    render(); // 그려주고          반복해야 애니매이션 효과 
    requestAnimationFrame(main);
    } else {
        ctx.drawImage(gameOverImage, 10, 100, 380, 380);
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
