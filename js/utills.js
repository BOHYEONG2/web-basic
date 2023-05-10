function hi() {
   alert("Hi!!!!!");
  console.log("Hi!!!!!!!!!!");
}

function sum(x, y) {
  //타입을 따로 쓰지 않는다
  let result = x + y;
  console.log(result);
}

function total(x, y) {
  return x + y;
}

function test() {
  let name = prompt("이름을 입력해주세요");

  if (name === "" || name === null) {
    name = prompt("입력해주세요 !!!!!");
  } else {
    console.log(name);
    alert(name + "님 안녕하세요");
  }
}

function test2() {
  let num = prompt("숫자를 입력해주세요");
  let i = 1;

  while (i === 1) {
    if (isNaN(num)) {
      alert("숫자만 입력해주세요");
      num = prompt("숫자를 입력해주세요");
    } else if (num < 1 || num > 100) {
      alert("1이상 100이하를 넣어주세요");
      num = prompt("숫자를 입력해주세요");
    } else {
      for (i = 1; i <= 100; i++) {
        console.log(i);
      }
      alert("완료되었습니다");
      i = 0;
      break;
    }
  }
}

function asknum() {
  let num = prompt("숫자를 입력해주세요");
  checknum(num);
}
function checknum(num) {
  if (isNaN(num)) {
    alert("숫자만 입력해주세요");
    asknum();
  } else if (num < 1 || num > 100) {
    alert("1이상 100 이하를 넣어주세요");
    asknum();
  } else {
    for (let i = 1; i <= 100; i++) {
      console.log(i);
    }
    alert("완료되었습니다");
  }
}

function test3() {
  let input = prompt("숫자를 입력해주세요.");
  let num = parseInt(input);

  if (isNaN(num)) {
    alert("숫자만 입력해 주세요");
    input = prompt("숫자를 입력해주세요");
  } else if (num < 1 || num > 100) {
    alert("1이상 100 이하를 넣어주세요.");
    input = prompt("숫자를 입력해주세요");
  } else {
    for (let i = 1; i <= 100; i++) {
      console.log(i);
    }
    alert("완료되었습니다.");
      }
    }
  

