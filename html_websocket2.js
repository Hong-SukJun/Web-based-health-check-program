let connection;
let sendSrc;

var cnt = 0;
var count = 0; // 전송데이터 count
var re = 0; // 응답 데이터 count 내용
var becnt = 0;
var resize = 300; //resize 할 크기
var label = [];
let data = null
var formData = new FormData();
var canvas = document.createElement('canvas');
canvas.width = resize;
canvas.height = resize;

var sendButton = document.querySelector('#capture');
var video = document.getElementById('video');
const Stress_val = document.getElementById('Stress_text');
const Pulse_val = document.getElementById('Pulse_text');
const Respiration_val = document.getElementById('Respiration_text');

video.width = resize;
video.height = resize;


function clearData() {
  Pulse_val.innerText = '-';
  Stress_val.innerText = '-';
  Respiration_val.innerText = '-';
  Pulse_val.style.color = 'red';
  Stress_val.style.color = 'red';
  Respiration_val.style.color = 'red';
}


// 브라우저에서 웹캠 액세스 권한 요청
navigator.mediaDevices.getUserMedia({video: true})
  .then(function(stream) {
    video.srcObject = stream;
  })
  .catch(function(error) {
    console.log("Error accessing camera: " + error);
  });


// wss 웹소켓 연결
const websocket2 = new WebSocket('wss://223.194.44.137:555');

websocket2.addEventListener('open', () => {
    console.log("websocket for stress_pulse_respiration Server connect success");
    connection = true;
});

websocket2.addEventListener('close', (event) => {
    console.log("websocket for stress_pulse_respiration Server Disconnect...");
    connection = false;
});

websocket2.addEventListener('error', (error) => {
    console.log("Cannot connect websocket for stress_pulse_respiration Server!!");
});

// 웹소켓 데이터 수신 부분
websocket2.addEventListener('message', (event) => {
  if (connected2){
    const receivedData2 = event.data;
    data = JSON.parse(receivedData2); //blob된 데이터를 json로 파싱
    if (data["id"] === "SPR") // id === "Stress_Pulse_Respiration"
    {

        // 데이터 적용
      
        const st_2 = `${data["Stress"]} / ${data["Pulse"]} / ${data["Respiration"]}`;
        Pulse_val.innerText = data["Pulse"];
        Stress_val.innerText = data["Stress"];
        Respiration_val.innerText = data["Respiration"];
        console.log(st_2);
    
 
    }
    // console.log(receivedData2);
    }});
    


// 웹소켓 데이터 전송
function sendMessage(message) {
    websocket2.send(message);
}


function getImg() {
  // @see 이미지 저장 형식
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
}



function toggleConnection2() {
    if (connected2) {
      clearInterval(sendSrcInterval); // setInterval 멈추기
      connected2 = false;
      websocket2.send('rest');
      clearData();
      
    } else {
      connected2 = true;
      Pulse_val.style.color = 'white';
      Stress_val.style.color = 'white';
      Respiration_val.style.color = 'white';

      sendSrcInterval = setInterval(function () {
        if (!connection) {
          clearInterval(sendSrcInterval);
        }
        var src = getImg();
        src = 'device' + 'num:' + src;
        sendMessage(src);
        count = count + 1;
        // @todo 전송 지연 변경
      }, 33);
    }
  }


let connected2 = false
const button2 = document.getElementById('capture');
button2.addEventListener('click', toggleConnection2);

  