// pose_div pose3d 인식/표시
const videoElement1 = document.getElementById('video');
const pose_div = document.getElementById('Pose-3d');
const face_div = document.getElementById('Face-3d');

// 포즈 공간생성
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, 680 / 480, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

// 페이스 공간 생성
var scene_face = new THREE.Scene();
var camera_face = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
var renderer_face = new THREE.WebGLRenderer();

const pointGeometry = new THREE.SphereGeometry(0.01, 16, 16);
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    //pose 업데이팅
    function onResults_pose(results) {
      if (results.poseLandmarks) {
       update3DScene(results.poseLandmarks);
      }
    }
    //face 업데이팅
    function onResults_face(results) {
      for (const landmarks of results.multiFaceLandmarks) {
        update3DScene_face(landmarks);
      }
  }

    //포즈객체생성
    const pose = new Pose({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }});
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    // 페이스 객체 생성
    const faceMesh = new FaceMesh({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }});
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    // 함수 대입
    faceMesh.onResults(onResults_face);
    pose.onResults(onResults_pose);
  


    async function main() {
      await videoElement1.requestVideoFrameCallback(async (now, metadata) => {
        // 포즈,페이스에 동영상 전송
        await pose.send({image: videoElement1});
        await faceMesh.send({image: videoElement1});
        requestAnimationFrame(() => {
          main();
        });
      });
    }
    // 비디오 스트림
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        videoElement1.srcObject = stream;
        videoElement1.addEventListener('loadedmetadata', () => {
          main();
        });
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    })();


  //포즈 랜더러 
 function init3DScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
  camera.position.z = 2;

  renderer.setSize(pose_div.clientWidth, pose_div.clientHeight - 50);
  document.getElementById("Pose-3d").appendChild(renderer.domElement);

  const pointGeometry = new THREE.SphereGeometry(0.01, 16, 16);
  const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  points = [];
  for (let i = 0; i < 33; i++) {
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    scene.add(point);
    points.push(point);
    animate();
  }

  lines = [];
  for (const connection of POSE_CONNECTIONS) {
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    lines.push(line);
  }
}

 function update3DScene(poseLandmarks) {
  for (let i = 0; i < poseLandmarks.length; i++) {
    const landmark = poseLandmarks[i];
    const point = points[i];
    point.position.set(landmark.x * 2 - 1, -landmark.y * 2 + 1, -landmark.z);
  }

  for (let i = 0; i < POSE_CONNECTIONS.length; i++) {
    const connection = POSE_CONNECTIONS[i];
    const line = lines[i];
    line.geometry.setFromPoints([
      points[connection[0]].position,
      points[connection[1]].position,
    ]);
  }

  renderer.render(scene, camera);
}
// 



// 페이스 랜더러
let points_face, lines_face;

function initData() {
points_face = [];
for (let i = 0; i < 468; i++) {
const point_face = new THREE.Mesh(pointGeometry, pointMaterial);
scene_face.add(point_face);
points_face.push(point_face);

}
animate_face();

lines_face = [];
for (const connection of POSE_CONNECTIONS) {
const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const geometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(),
  new THREE.Vector3(),
]);
const line_face = new THREE.Line(geometry, material);
scene_face.add(line_face);
lines_face.push(line_face);
}
}

function init3DScene_face() {
camera_face.position.z = 2;
renderer_face.setSize(face_div.clientWidth, face_div.clientHeight - 50);
document.getElementById("Face-3d").appendChild(renderer_face.domElement);

initData()
}

function update3DScene_face(Landmarks) {

  for (let i = 0; i < Landmarks.length - 10; i++) {
    const landmark = Landmarks[i];
    const point = points_face[i];
    point.position.set(landmark.x * 2 - 1, -landmark.y * 3+ 1, -landmark.z);
  }
  renderer_face.render(scene_face, camera_face);
  }

//


// 포즈 애니메이션
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

//페이스 애니메이션
function animate_face() {
  requestAnimationFrame(animate);
  camera_face.position.z = 1;
  renderer_face.render(scene_face,camera_face);
}

// 초기설정 각각
init3DScene();
init3DScene_face();
