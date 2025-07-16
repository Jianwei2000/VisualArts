import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// 宣告全域變數：相機、場景、渲染器、幾何體、材質、立方體網格、時鐘、控制器
let camera, scene, renderer, clock;
// 儲存所有煙霧粒子的陣列
let smokeParticles = [];






// 1.建立場景物件
scene = new THREE.Scene();
// 2.建立透視相機：視角75度、比例為視窗大小、近裁剪面1、遠裁剪面10000
camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.z = 1000; // 相機往 z 軸後退
scene.add(camera); 
// 3.建立渲染器，並設定渲染尺寸為整個視窗
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);



//建立時鐘
clock = new THREE.Clock();


// 建立燈光 照亮場景
const light = new THREE.DirectionalLight(0xffffff, 10);
light.position.set(100, 100, 20); // 從右上前方照過來
scene.add(light);


  // 載入煙霧材質
const smokeTexture = new THREE.TextureLoader().load("smoke.png");

// 將煙霧材質套用在平面上 並設定透明度
const smokeMaterial = new THREE.MeshLambertMaterial({
  color:  0xffffff,
  map: smokeTexture,
  transparent: true,
});

// 建立煙霧的幾何體（平面 300x300）
const smokeGeo = new THREE.PlaneGeometry(300, 300);

// 建立 150 個煙霧粒子，隨機分佈在場景中
for (let p = 0; p < 150; p++) {
  var particle = new THREE.Mesh(smokeGeo, smokeMaterial.clone());
  particle.position.set(
    Math.random() * 1000 - 500, // x 位置：-500 ~ 500
    Math.random() * 500 - 250, // y 位置：-250 ~ 250
    Math.random() * 1100 - 100 // z 位置：-100 ~ 900
  );
  particle.rotation.z = Math.random() * 360; // 初始旋轉角度
  scene.add(particle); // 加入場景
  smokeParticles.push(particle); // 加入陣列
}

// 滑鼠移動事件
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {

mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//相機視角移動
camera.position.set(mouse.x * 50 ,mouse.y * 50 );
//人物移動
const man = document.querySelector(".man");
man.style.transform = `translateX(${mouse.x*-100}px)`;
//cursor特效
const cursor = document.querySelector('.cursor-effect');
cursor.style.left = `${event.clientX}px`;
cursor.style.top = `${event.clientY}px`;

});

//resize不讓畫面跑版
window.addEventListener('resize', () => {
  // 更新相機比例
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  // 更新渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 將渲染器畫面加入網頁中
document.body.appendChild(renderer.domElement);


animate();  //執行動畫  

function animate(){

  requestAnimationFrame(animate); // 持續呼叫自己產生動畫效果

  const delta = clock.getDelta();

  // 每個煙霧粒子緩慢旋轉
  for (let i = 0; i < smokeParticles.length; i++) {
    smokeParticles[i].rotation.z += delta * 0.1;
  }



  renderer.render(scene, camera); // 渲染場景
}



const texts = ["Towards Freedom", "Design By JianWei", "Copyright © 2025"];
const container = document.querySelector(".text");
let textIndex = 0;
let charIndex = 0;

typeNext(); // 開始打字效果
function typeNext() {
  if (charIndex < texts[textIndex].length) {
    container.textContent += texts[textIndex][charIndex];
    charIndex++;
    setTimeout(typeNext, 100);
  } else {
    setTimeout(() => {
      container.textContent = "";
      charIndex = 0;
      textIndex = (textIndex + 1) % texts.length; // 換下一段文字
      typeNext();
    }, 5000);
  }
}


