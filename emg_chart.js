let connected = false;
let port = null;
const button = document.getElementById('toggleButton');

async function toggleConnection() {
  if (connected) {
    await disconnect();
  } else {
    await connect();
  }
}

button.addEventListener('click', toggleConnection);

// emg_port_connection
async function connect() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 250000 });
    console.log('Connected to port ' + port.name);
    readData();
    connected = true;
  } catch (err) {
    console.log('Error: ' + err);
  }
}

// emg_port_disconnection
async function disconnect() {
  if (!port) return;
  try {
    await reader.cancel();
    await port.close();
    port = null;
    console.log('Disconnected');
    connected = false;
  } catch (err) {
    console.log('Error: ' + err);
  }
}



// emg_chart_drwaing
let rawList = new Array(10).fill(0);
let avgList = new Array(10).fill(0);
let fitList = new Array(200).fill(0);
const box = new Array(10).fill(1 / 10);

var update
let trace = { x: [...Array(200).keys()], y: fitList, mode: 'lines', line: {color: 'rgb(255, 0, 0)', width: 3},
              marker: {
                color: 'blue',
                size: 10,
                symbol: 'circle'
              }};
let layout = { xaxis: {visible: false, fixedrange: true, range: [0, 200], showgrid: false, zeroline: false, showline: false, showticklabels: false},
               yaxis: {visible: false, fixedrange: true, showgrid: false, zeroline: false, showline: false, showticklabels: false},
                margin: {l: 0,r: 0,b: 0,t: 0,pad: 0}, plot_bgcolor:"black", paper_bgcolor:"#black",
                width: document.getElementById("Emg").clientWidth,
                height: document.getElementById("Emg").clientHeight - 50};
Plotly.newPlot('Emg', [trace], layout);



async function readData() {
  try {
    const decoder = new TextDecoder();
    reader = port.readable.getReader();
    let buffer = "";

    while (port) {
      const { value, done } = await reader.read();
      if (done) break;
      const data = decoder.decode(value);
      buffer += data;

      let lineEndIndex = buffer.indexOf('\n');

      while (lineEndIndex !== -1) {
        const recv_data = buffer.slice(0, lineEndIndex).trim();
        buffer = buffer.slice(lineEndIndex + 1);

        if (recv_data.length > 1) {
          const raw_value = parseInt(recv_data);
          rawList.push(raw_value);
          rawList.shift();
          const avg_value = avg(rawList);
          avgList.push(avg_value);
          avgList.shift();
          const fit_value = convolve(avgList, box);
          fitList.push(fit_value);
          fitList.shift();
          // console.log(fitList);
          updateGraph();
        }

        lineEndIndex = buffer.indexOf('\n');
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function convolve(arr1, arr2) {
  const arr3 = [];
  const n = arr1.length + arr2.length - 1;
  for (let i = 0; i < n; i++) {
    arr3[i] = 0;
    for (let j = 0; j < arr2.length; j++) {
      if (i - j >= 0 && i - j < arr1.length) {
        arr3[i] += arr1[i - j] * arr2[j];
      }
    }
  }
  return arr3[arr3.length - 1];
}

function updateGraph() {
  Plotly.update('Emg', { y: [fitList]});
}


