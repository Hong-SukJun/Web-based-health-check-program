const temp_hum = document.getElementById("temp_hum");

const webSocket = new WebSocket('wss://localhost:443');

// 웹소켓 커넥트 부분 (open)
webSocket.addEventListener('open', () => {
    console.log("temp_hum WSS connect success");
});

webSocket.addEventListener('close', (event) => {
    console.log('temp_hum WSS closed:', event.code, event.reason);
});

webSocket.addEventListener('error', (error) => {
    console.error('temp_hum WSS connect error:', error);
});


// 웹소켓 데이터 받아들이는 부분
webSocket.addEventListener('message', (event) => {
    const receivedData = event.data;
    const fileReader = new FileReader(); // blob 데이터를 read하는 객체 
    fileReader.onload = function() { //onload될시 이 함수를 호출
        const data = JSON.parse(fileReader.result); //blob된 데이터를 json로 파싱
        if (data["id"] === "temp_hum") // id === "온습도"
        {
        const st_ = `${data["temp_val"]} °C / ${data["hum_val"]} %`;
        temp_hum.innerText = st_;
        // console.log(data);
        }

    };
    fileReader.readAsText(receivedData); // 데이터 불러오기

})


