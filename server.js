const https = require('https');
// const WebSocketServer = require('websocket').server;
const WebSocket = require('ws');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 443;


// certs 로드
const options = {
  cert: fs.readFileSync('certs/veea.crt.pem'),
  key: fs.readFileSync('certs/veea.key.pem')
};

app.use(express.static(path.join(__dirname, './')));

// 메인 view
app.get('/main', (req,res) => {
  res.sendFile(path.join(__dirname,'/main.html'));
})


// 에러처리, 최후의 수단
app.use((error, req, res, next) => { 
  console.error(error);
  res.status(500).json({ message: 'Something went wrong' });
});



// 메인 https 서버
const server = https.createServer(options, app);
server.listen(port, () => {
  console.log("https server listening on port " + port);
});


//wss 적용 
const wsServer = new WebSocket.Server({ server });

wsServer.on("connection",(wss)=> {
  console.log ('Someone connect to server');

  wss.on('message', (message) => {

    // 송신자들에게 데이터 전송
    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        console.log(`Send message: ${message}`);
      }});

  });

  wss.on('close', () => {
    console.log('Connection closed');
  });

  // 오류 발생 시 처리
  wss.on('error', (error) => {
    console.error(error);
  });
});