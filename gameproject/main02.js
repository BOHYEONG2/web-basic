let canvas;
let ctx;
let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;
let gameOver=false  // true이면 게임이 끝남, false이면 게임이 안끝남
let score = 0;
//우주선 좌표
let spaceshipX, spaceshipY;
const spaceshipWidth = 64;

let bulletList = []; // 총알 목록
let enemyList = [];  // 적군 목록

// 이미지 로드
function loadImage() {              // 이미지 가져오는 함수
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

// 키보드 이벤트 리스너 등록
function setupKeyboardListener() {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowLeft') {
            spaceshipX -= 10;
        } else if (event.code === 'ArrowRight') {
            spaceshipX += 10;
        } else if (event.code === 'Space') {
            createBullet();
        }
    });
}

// 적군 생성
function createEnemy() {
    setInterval(() => {
        const enemyX = Math.floor(Math.random() * (canvas.width - 32));
        const enemyY = -32;
        const enemy = {x: enemyX, y: enemyY};
        enemyList.push(enemy);
    }, 1000);
}

// 총알 생성
function createBullet() {
    const bulletX = spaceshipX + 28;
    const bulletY = spaceshipY - 32;
    const bullet = {x: bulletX, y: bulletY};
    bulletList.push(bullet);
}

// 게임 오버 처리
function gameover() {
    gameOver = true;
}

// 총알 이동 처리
function moveBullet() {
    for (let i = 0; i < bulletList.length; i++) {
        bulletList[i].y -= 10;
        if (bulletList[i].y < -32) {
            bulletList.splice(i, 1);
            i--;
        }
    }
}

// 적군 이동 처리
function moveEnemy() {
    for (let i = 0; i < enemyList.length; i++) {
        enemyList[i].y += 5;
        if (enemyList[i].y > canvas.height) {
            enemyList.splice(i, 1);
            i--;
        }
    }
}

function detectCollision() {
    for (let i = 0; i < enemyList.length; i++) {
        const enemy = enemyList[i];
        for (let j = 0; j < bulletList.length; j++) {
            const bullet = bulletList[j];
            if (bullet.x + 32 > enemy.x && bullet.x < enemy.x + 32 &&
                bullet.y + 32 > enemy.y && bullet.y < enemy.y + 32) {
                // 충돌이 감지됐을 때
                enemyList.splice(i, 1);
                bulletList.splice(j, 1);
                score += 10;
                break;
            }
        }
        if (spaceshipX + spaceshipWidth > enemy.x && spaceshipX < enemy.x + 32 &&
            spaceshipY + 32 > enemy.y && spaceshipY < enemy.y + 32) {
            // 충돌이 감지됐을 때
            gameover();
        }
    }
}

function checkCollisions() {
    // 적군과 우주선 충돌 검사
    enemyList.forEach((enemy) => {
      if (
        spaceshipX < enemy.x + enemy.width &&
        spaceshipX + spaceshipWidth > enemy.x &&
        spaceshipY < enemy.y + enemy.height &&
        spaceshipY + spaceshipHeight > enemy.y
      ) {
        // 우주선과 충돌한 경우 게임 오버
        gameOver = true;
      }
    });
  
    // 우주선 총알과 적군 충돌 검사
    bulletList.forEach((bullet) => {
      enemyList.forEach((enemy) => {
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          // 적군과 충돌한 경우 점수 추가하고 총알, 적군 제거
          score += 10;
          bulletList.splice(bulletList.indexOf(bullet), 1);
          enemyList.splice(enemyList.indexOf(enemy), 1);
        }
      });
    });
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
    spaceshipX = (canvas.width - spaceshipWidth) / 2;
    bulletList = [];
    enemyList = [];
    gameOver = false;

    // 게임 루프 시작
    main();
}

function resetGame() {
    // 이미지 로드
    loadImage();

    // 키보드 이벤트 리스너 등록
    setupKeyboardListener();

    // 적군 생성
    createEnemy();
}

function createRestartButton() {
    const restartButton = document.createElement('button');
    restartButton.id = 'restart-button';
    restartButton.innerText = '게임 재시작';
    restartButton.style.display = 'none';
    document.body.appendChild(restartButton);
    restartButton.addEventListener('click', () => {
        restartButton.style.display = 'none';
        resetGame();
        startGame();
    });
}

function main() {
    if(!gameOver) {
        update();
        render();
        requestAnimationFrame(main);
    } else {
        const restartButton = document.getElementById('restart-button') || createRestartButton();
        restartButton.style.display = 'block';
        ctx.drawImage(gameOverImage, 10, 100, 380, 380);
    }
}

resetGame();
startGame();

loadImage();
setupKeyboardListener();
createEnemy();
startGame();