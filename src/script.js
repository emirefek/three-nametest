import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Material, MeshLambertMaterial } from "three";
import GUI from "lil-gui";
import { generateUUID } from "three/src/math/mathutils";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

// THREE scene setup
const scene = new THREE.Scene();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Renderer
const canvas = document.querySelector("#webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 10;
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/*
 * Loaders
 */
const textureLoader = new THREE.TextureLoader();
const donutTex = textureLoader.load("/textures/matcaps/3.png");
const textTex = textureLoader.load("/textures/matcaps/9.png");

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("emirefek", {
    font: font,
    size: 1,
    height: 0.01,
    curveSegments: 4,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3,
  });
  textGeometry.center();
  //textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   (textGeometry.boundingBox.max.x - 0.02) * -0.5,
  //   (textGeometry.boundingBox.max.y - 0.02) * -0.5,
  //   (textGeometry.boundingBox.max.z - 0.03) * 0.5
  // );
  console.log(textGeometry.boundingBox);

  const text = new THREE.Mesh(
    textGeometry,
    new THREE.MeshMatcapMaterial({ matcap: textTex })
  );
  scene.add(text);
});

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/*
 * DONUTS
 */
console.time("donats deploying");

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: donutTex });

for (let i = 0; i < 100; i++) {
  const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  donut.position.x = (Math.random() - 0.5) * 20;
  donut.position.y = (Math.random() - 0.5) * 20;
  donut.position.z = (Math.random() - 0.5) * 20;
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;
  scene.add(donut);
}
console.timeEnd("donats deploying");

/*
 *  GUI
 */

const gui = new GUI();

/*
 * Tick loop
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Update objects

  // Update controls
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();
