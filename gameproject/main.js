

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
    this.x = 0;     // 총알 x 좌표
    this.y = 0;     // 총알 y 좌표
    this.init = function() {
        this.x = spaceshipX +18;        
        this.y = spaceshipY;
        this.alive = true // true면 살아있는 총알 false면 죽은 총알
        bulletList.push(this);
    };

    //총알 발사는 y좌표값이 줄어든다는거
    this.update = function () {
        this.y -= 8;
};


this.checkHit = function() {            // 총알객체와 우주선이 충돌했을 때 점수를 증가시키는 역할
    for(let i = 0; i < enemyList.length; i++) {      //for루프로  enemylist 배열의 모든 적 우주선을 검사하고
        if(
            this.y <= enemyList[i].y &&             // this(총알) y 좌표가 우주선의 y 좌표보다 작으면
            this.x >= enemyList[i].x &&             // 총알의 x 좌표가 우주선의 x 좌표보다 크거나같으면 << 우주선 x좌표는 좌우 경계를 말함
            this.x <= enemyList[i].x + 45           // 총알이 적 우주선과 충돌했는지 검사하는 부분 우주선의 , x 좌표 오류생각해서 45정도 좌표값 더줌
            ) {
            // 총알과 적 우주선이 닿으면 사라지고 점수 획득
            score += 10;
            this.alive = false // (죽은 총알)  this(총알) 개체의 alive속성을 false로 하여 게임에서 보이지 않도록 한다 
            enemyList.splice(i, 1);    //  enemylist(적우주선)   index i번쨰 요소를 1개 제거하라는 뜻(splice) 배열에 저장한거에서 사라지니 우주선이 화면에서 사라짐
            
        }
    }
};
}

// 적군 저장하는 리스트 
let enemyList = [];
function generateRandomValue(min,max) {   // min~max 사이의 랜덤값을 생성하는 함수
    let randomNum = Math.random()*(max-min+1)  
    return randomNum;  
}

let enemySpeed = 2;
function Enemy(){
    this.x = 0;     // 적 개체 x좌표 
    this.y = 0;     // 적 개체 y좌표
    this.init = function () {   // 적 객체의 초기 위치를 설정하는 메소드 
        this.y=0
        this.x=generateRandomValue(0,canvas.width - 60); // x좌표는 랜덤으로 설정
        enemyList.push(this);                       // 생성된 객체를 배열에 추가
    };
    //적군의 속도 조절
    this.update=function () {   // 적 위치 업데이트
        this.y += enemySpeed;            // y좌표가 높을수록 내려오는 속도가 빨라짐

        if (this.y >= canvas.height - 55) {  // y좌표가 바닥에 도달하면  게임오버가 되게
            gameOver = true;

        }
    };
}

function loadImage() {              // 이미지 가져오는 함수
    backgroundImage = new Image();
    backgroundImage.src="../images/background.png";

    gameOverImage = new Image();
    gameOverImage.src="../images/gameoverimg.jpg";

    bulletImage = new Image();
    bulletImage.src="../images/bullet.png";

    spaceshipImage = new Image();
    spaceshipImage.src="../images/spaceship.png";

    enemyImage = new Image();
    enemyImage.src="../images/enemy.png";
    
}

// let keysdown= {};
// function setupKeyboardListener() {
//     document.addEventListener("keydown",function (event) {
//         keysdown[event.key] = true;
//       //  console.log("키값",keysdown);
//     });
//     document.addEventListener("keyup", function (event) {
//         delete keysdown[event.key];

//         if ( ' ' in keysdown) {
//     //   if ( event.key === 32) {
//             createBullet(); // 총알 생성
//         }
//     });
// }

let isJumping = false;

function jump() {
    isJumping = true;
    spaceshipY.animate({ bottom: '+=200px' }, "fast" );
    spaceshipY.animate({ bottom: '-=200px'}, "fast", function () {
        isJumping = false;
    });
}

let keysdown = {};

function setupKeyboardListener() {
    document.addEventListener("keydown", function(event) {
        if (event.key === ' ') {
            if (!(' ' in keysdown)) {
                keysdown[' '] = true;
                createBullet();
            }
        } else if ( event.key === 'a') {
            jump();
        } else {
            keysdown[event.key] = true;
        }
    });

    document.addEventListener("keyup", function(event) {
        delete keysdown[event.key];
    });
}


    function createBullet() {
     console.log("총알생성");
    
        let b = new Bullet(); // 총알 하나 생성
        b.init();
    }
    
  //  setInterval 함수는 일정한 시간 간격으로 특정 코드를 반복적으로 실행하는 함수입니다.
    function createEnemy() {
        const interval = setInterval(function() { 
            let e = new Enemy();
            e.init()  // setInterval 함수로 0.5초마다 init을 불러옴 init은 적 개체 랜덤하게 나타내는 코드가 있음
        },500);    // 0.5초마다 적군 개체수를 생성  
    }

 //   let b = new Bullet(); // 총알 하나 생성
  //  b.init();  // 초기화 한다는 함수
    
function update() {
    if ( 'ArrowRight' in keysdown) {
        spaceshipX += 5;   // 우주선 속도
    }  // 오른쪽이동
    if ( 'ArrowLeft' in keysdown) {
        spaceshipX -= 5;
    }

    if(spaceshipX <= 0) {
        spaceshipX= 0;
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
        if(bulletList[i].alive) {
           bulletList[i].update()
           bulletList[i].checkHit();
     }
    }

    for(let i = 0; i < enemyList.length; i++) {
        enemyList[i].update();
    }
    // if ( score >= 200 && score % 200 === 0) {  // score가 200의 배수일 때마다
    //     enemySpeed ++;        // enemySpeed를 1 증가시킴
    //   }
    
    if( score >= 800) {
        enemySpeed = 10;
    } else if ( score >= 500) {
        enemySpeed = 8;
    } else if ( score >= 400) {
        enemySpeed = 7;
    } else if ( score >= 300) {
        enemySpeed = 5;
    } else if ( score >= 100) {
        enemySpeed = 3;
    }
    
}

function render() {                         // 캔버스에 화면 그리기
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);  // 캔버스 배경
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);          // 우주선
    ctx.fillText(`score:${score}`, 10, 30);
    ctx.fillstyle = "white";
    ctx.font = "40px Arial";  

// 우주선 초기값으로 시작하고
//총알을  넣어줄 배열 x 총알들을 넣어주는 배열 ,
    for(let i = 0; i <bulletList.length; i++) {
        if ( bulletList[i].alive) {                             // 총알 그리기
        ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);         
        }
    }
    for(let i = 0; i< enemyList.length; i++) {                  // 적군 그리기
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
    }
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }



function main() {
    if(!gameOver) {
        update(); // 좌표값을 업데이트하고
        render(); // 그려주고          반복해야 애니매이션 효과 
        requestAnimationFrame(main);
    } else {
        const restartButton = document.getElementById('restart-button');
        restartButton.style.display = 'block';
        restartButton.removeEventListener('click', restartGame); // 이전 핸들러 제거
        restartButton.addEventListener('click', () => {
          // 게임 변수 초기화
          score = 0;
          spaceshipX = (canvasWidth - spaceshipWidth) / 2;
          bulletList = [];
          enemyList = [];
          gameOver = false;

           // 캔버스 초기화
           clearCanvas();
    
          // 이미지 로드
          loadImage();
    
          // 키보드 이벤트 리스너 등록
          setupKeyboardListener();
    
          // 적군 생성
          createEnemy();
    
          // 게임 루프 재시작
          main();
    
          restartButton.style.display = 'none';
        });
        ctx.drawImage(gameOverImage, 10, 100, 380, 380);
    }
}

function startGame() {
    if (canvas) {
        canvas.remove();
    }
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 700;
    document.body.appendChild(canvas);

    // 변수 초기화
    score = 0;
    spaceshipX = (canvasWidth - spaceshipWidth) / 2;
    bulletList = [];
    enemyList = [];
    gameOver = false;

    // 이미지 로드
    loadImage();

    // 키보드 이벤트 리스너 등록
    setupKeyboardListener();

    // 적군 생성
    createEnemy();

    // 게임 루프 시작
    main();
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
