let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;

document.body.appendChild(canvas); // 자식으로 붙여준다

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage, rocketImage;
let gameOver = false; // true이면 게임이 끝남, false이면 게임이 안끝남
let score = 0;
//우주선 좌표
let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64;

let bulletList = []; // 총알 저장하는 리스트

function Bullet() {
  this.x = 0; // 총알 x 좌표 초기위치
  this.y = 0; // 총알 y 좌표
  this.init = function () {
    this.x = spaceshipX + 18;   // 총알위치가 우주선 x좌표 +18 (이렇게 해야 가운데에서 발사)
    this.y = spaceshipY;
    this.alive = true; // true면 살아있는 총알 false면 죽은 총알
    bulletList.push(this);   // 생성된 총알 객체를 bulletlist에 추가 //bulletList는 현재 화면에 존재하는 모든 총알 객체를 담고 있다.
  };

  //총알 발사는 y좌표값이 줄어든다는거
  this.update = function () {
    //총알 발사 함수
    this.y -= 4; // 화면 밖 점수오르는거 고치는데 4시간걸림.
    if (this.y < 0) {
      // 이 코드가 없어서 총알이 적에 닿지않고 밖으로 나가도 점수가 올랐는데
      this.alive = false; // 총알의 y 좌표가 0보다 작아지면(총알이 화면밖으로 나가면)
      // 총알 alive 속성이 false가 되어 죽은처리가됨
    }
  };

  this.checkHit = function () {
    // 총알객체와 우주선이 충돌했을 때 점수를 증가시키는 역할
    for (let i = 0; i < enemyList.length; i++) {
      //for루프로  enemylist 배열의 모든 적 우주선을 검사하고
      if (
        this.y <= enemyList[i].y && // this(총알) y 좌표가 우주선의 y 좌표보다 작으면
        this.x >= enemyList[i].x && // 총알의 x 좌표가 우주선의 x 좌표보다 크거나같으면 << 우주선 x좌표는 좌우 경계를 말함
        this.x <= enemyList[i].x + 45 // 총알이 적 우주선과 충돌했는지 검사하는 부분 우주선의 , x 좌표 오류생각해서 45정도 좌표값 더줌
      ) {
        // 총알과 적 우주선이 닿으면 사라지고 점수 획득
        score += 10;
        this.alive = false; // (죽은 총알)  this(총알) 개체의 alive속성을 false로 하여 게임에서 보이지 않도록 한다
        enemyList.splice(i, 1); //  enemylist(적우주선)   index i번쨰 요소를 1개 제거하라는 뜻(splice) 배열에 저장한거에서 사라지니 우주선이 화면에서 사라짐
      }
    }
  };
}
let rocketList = [];
let isRocketAllowed = true;
let rocketCount = 0;

function Rocket() {
    this.x = 0;   // 로켓 x 좌표
    this.y = 0;   // 로켓 y 좌표
    this.timeCreated = 0; 
  
    // 로켓 초기화 함수
    this.init = function() {
   //   this.x =  + 38;   x를 고정시켜두면 한곳에서 로켓이 나가니 x를 빼주면 된다.
      this.y = spaceshipY;
      this.alive = true;  // true면 살아있는 로켓 false면 죽은 로켓
      rocketList.push(this);  // 로켓 배열에 추가.
    };
  
    // 로켓 업데이트 함수
    this.update = function() {
      this.y -= 5; // 로켓이 위로 올라가는 속도를 빠르게 하기 위해 10으로 수정
      if (this.y < 0) { // 화면 밖으로 나가면 로켓이 사라짐
        this.alive = false;  // 죽은 로켓 (죽지 않으면 점수가 올라가서 추가해줘야함)
      }
    };
  
    // 로켓 충돌 검사 함수
    this.checkHit = function() {
      for (let i = 0; i < enemyList.length; i++) {
        if (
          this.y <= enemyList[i].y + 40 && // 로켓 y 좌표가 적 우주선의 y 좌표보다 작으면
          this.x + 8 >= enemyList[i].x && // 로켓 x 좌표가 적 우주선의 x 좌표보다 크거나 같고
          this.x + 8 <= enemyList[i].x + 50 // 로켓 x 좌표가 적 우주선의 x 좌표+45보다 작으면
        ) {
          score += 10; // 점수 획득
          this.alive = false; // 로켓이 사라짐
          enemyList.splice(i, 1); // 적 우주선 삭제
        }
      }
    };
  }

  
// 적군 저장하는 리스트
let enemyList = [];
function generateRandomValue(min, max) {
  // min~max 사이의 랜덤값을 생성하는 함수
  let randomNum = Math.random() * (max - min + 1);
  return randomNum;
}

let enemySpeed = 1;
function Enemy() {
  this.x = 0; // 적 개체 x좌표
  this.y = 0; // 적 개체 y좌표
  this.init = function () {
    // 적 객체의 초기 위치를 설정하는 메소드
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 60); // x좌표는 랜덤으로 설정
    enemyList.push(this); // 생성된 객체를 배열에 추가
  };
  //적군의 속도 조절
  this.update = function () {
    // 적 위치 업데이트
    this.y += enemySpeed; // y좌표가 높을수록 내려오는 속도가 빨라짐

    if (this.y >= canvas.height - 55) {
      // y좌표가 바닥에 도달하면  게임오버가 되게
      gameOver = true;
    }
  };
}

function loadImage() {
  // 이미지 가져오는 함수
  backgroundImage = new Image();
  backgroundImage.src = "../images/background.png";

  gameOverImage = new Image();
  gameOverImage.src = "../images/gameover.jpg";

  bulletImage = new Image();
  bulletImage.src = "../images/bullet.png";

  spaceshipImage = new Image();
  spaceshipImage.src = "../images/spaceship.png";

  enemyImage = new Image();
  enemyImage.src = "../images/enemy.png";

  rocketImage = new Image();
  rocketImage.src = "../images/rocket.png";
}


let keysdown = {};

function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    //키보드 이벤트리스너 등록
    if (event.key === " ") {
      // 눌려진 키보드가 spacebar 라면
      if (!(" " in keysdown)) {
        // 스페이스바가 처음 눌러졌다면
        keysdown[" "] = true; // 총알생성
        createBullet(); // 눌리는거 방지는 밑에 delete
      }
    } else if (event.key === "a") {
      keysdown[" "] = true;
      createrocket(); // a 키를 누르면 createRocket 함수 호출
    } else {
      keysdown[event.key] = true;
    }
  });

  document.addEventListener("keyup", function (event) {
    // 키보드에서 손을 뗄 때
    delete keysdown[event.key]; // keysdown에서 삭제  >> 총알 누르고 있는거 방지하기위해서
  });
}

/*function createrocket() {
    console.log("로켓생성");
    for (let i = 0; i < 10; i++) {  // 10개의 로켓을 생성
      let r = new Rocket();
      r.x = spaceshipX + 18 + (i - 4.5) * 20; // 로켓 x 좌표 설정
      r.init();
    }
  }
*/
function createrocket() {
  
  console.log("로켓생성");
  const numRockets = 20;          // 생성할 로켓의 갯수
  const timeBetweenRockets =0; // 0초 간격으로 로켓 생성
  let i = 0;
  const intervalId = setInterval(() => { // setInterval 이용하여 로켓 생성을 반복 
    if (i >= numRockets) {        // i >= numrocket setInterval 정지하고 함수 반환 
      clearInterval(intervalId);
      rocketCount = 0;
     
      return;
    }
    const r = new Rocket();
    r.x = i * 20; // 로켓 x 좌표 설정
    r.timeCreated = Date.now(); // 생성 시간 설정
    r.init();   // 로켓 초기화 >> 로켓을 생성할 때 마다 로켓의 초기값을 설정해줘야함 그게 init();
    rocketList.push(r); // 로켓 배열에 추가.
    i++;                 // i를 증가시켜 Rocket의 x좌표 값을 설정 

  }, timeBetweenRockets);
}


  


function createBullet() {
  console.log("총알생성");

  let b = new Bullet(); // 총알 하나 생성
  b.init();
}

//  setInterval 함수는 일정한 시간 간격으로 특정 코드를 반복적으로 실행하는 함수입니다.
function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init(); // setInterval 함수로 0.5초마다 init을 불러옴 init은 적 개체 랜덤하게 나타내는 코드가 있음
  }, 1200); // 0.5초마다 적군 개체수를 생성
}

//   let b = new Bullet(); // 총알 하나 생성
//  b.init();  // 초기화 한다는 함수

function update() {
  if ("ArrowRight" in keysdown) {
    spaceshipX += 5; // 우주선 속도
  } // 오른쪽이동
  if ("ArrowLeft" in keysdown) {
    spaceshipX -= 5;
  }

  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }

  if (spaceshipX >= canvas.width - 60) {
    spaceshipX = canvas.width - 60;
  }
  // 우주선이 맵 밖으로 나가지 않게 하기 위해서

 
  // 총알의 y좌표 업데이트 하는 함수 호출

  // 총알이 여러개니
  //bulletList안에 있는 것들은 update를 계속 호출함 update는 메인에 있으니
  // update는 계속 -7씩하게됨
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {      // 총알이 살아있는지 확인, alive=true일 경우에 아래가 실행
      bulletList[i].update();       // 총알 객체의 위치와 상태 업데이트
      bulletList[i].checkHit();     // 총알과 적군 충돌검사 
    }
  }
  for (let i = 0; i < rocketList.length; i++) {
    if (rocketList[i].alive) {
      rocketList[i].update();
      rocketList[i].checkHit();
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }

  // if ( score >= 200 && score % 200 === 0) {  // score가 200의 배수일 때마다
  //     enemySpeed ++;        // enemySpeed를 1 증가시킴
  //   }

  if (score >= 1500) {
    enemySpeed = 5;
  } else if (score >= 1000) {
    enemySpeed = 4;
  } else if (score >= 800) {
    enemySpeed = 3;
  } else if (score >= 500) {
    enemySpeed = 2;
  } else if (score >= 300) {
    enemySpeed = 1.5;
  }
}

function render() {
  // 캔버스에 화면 그리기
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 캔버스 배경
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY); // 우주선
  ctx.fillStyle = "black";
  ctx.fillText(`score:${score}`, 10, 30 , );
  ctx.fillText(`rocket:${rocketList.length}`, 10, 70); // 로켓 발사 가능 횟수 표시
  
  ctx.font = "40px Arial";

  // 우주선 초기값으로 시작하고
  //총알을  넣어줄 배열 x 총알들을 넣어주는 배열 ,
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      // 총알 그리기
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }
  for (let i = 0; i < rocketList.length; i++) {
    if (rocketList[i].alive) {
      // 총알 그리기
      ctx.drawImage(rocketImage, rocketList[i].x, rocketList[i].y);
    }
  }

 
  for (let i = 0; i < enemyList.length; i++) {
    // 적군 그리기
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  if (!gameOver) {
    update(); // 좌표값을 업데이트하고
    render(); // 그려주고          반복해야 애니매이션 효과
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);

    // 재시작 버튼 보여주기
    document.getElementById("restart-button").style.display = "block";

    const restartButton = document.getElementById("restart-button");
    restartButton.removeEventListener("click", restartGame); // 이전 핸들러 제거
    restartButton.addEventListener("click", restartGame); // 새 핸들러 추가
  }
}

// 게임 재시작 함수
function restartGame() {
  // 게임 변수 초기화
  score = 0;
  spaceshipX = canvas.width / 2 - 32;
  spaceshipY = canvas.height - 64;
  bulletList = [];
  enemyList = [];
  gameOver = false;
  const ENEMY_SPEED = 1 // 애먹었는데, 재시작하면 빨라진 속도 다시 스피드2로하는 코드

  // 캔버스 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  
  
 
  main();
  // 게임 루프 재시작
  
  if(!gameOver){ 
  // 재시작 버튼 숨기기
  document.getElementById("restart-button").style.display = "none";
  }
 
}

// HTML 로드가 완료되면 이벤트 리스너를 버튼에 추가
window.onload = function () {
  const restartButton = document.getElementById("restart-button");
  restartButton.addEventListener("click", restartGame);
};

$(document).ready(function() {
  // Start Game 버튼 클릭시
  $('#start-button').click(function() {
    // 배경 이미지 숨기기
    $('#background-img').hide();
    // 게임 시작 버튼 보이기
    $(this).hide();
   // $('#restart-button').show();
    // 게임 시작
    startGame();
  });
});

function startGame() {
  loadImage();
  setupKeyboardListener();
  createEnemy();
  main();
  document.getElementById("start-button").style.display = "none";
}

document.getElementById("start-button").addEventListener("click", startGame);