// 시간 구하기 
const clock = document.getElementById("time");

function getClock(){
    const date = new Date()
    const year = String(date.getFullYear()).padStart(2,"0");
    const month = String(date.getMonth() + 1).padStart(2,"0");
    const day = String(date.getDate()).padStart(2,"0");
    const hour = String(date.getHours()).padStart(2,"0");
    const minutes = String(date.getMinutes()).padStart(2,"0");
    const second = String(date.getSeconds()).padStart(2,"0");//number이기 때문에 padStart 붙일 수 없음. String 변환해주어야한다.
    clock.innerText = `${year}년 ${month}월 ${day}일 ${hour}:${minutes}:${second}`;
    }
    
  getClock();
  setInterval(getClock, 1000); //1초마다 자동 동기화
