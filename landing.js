import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Pane } from "tweakpane";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x242424);

// const pane = new Pane();

// add tetrahedron
const geometry = new THREE.TetrahedronGeometry(1, 0);
const material = new THREE.MeshStandardMaterial();
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// pane.addBinding(
//     mesh.rotation, 'x', {min: 0, max: Math.PI, step: 0.01},
// )
// pane.addBinding(
//     mesh.rotation, 'y', {min: 0, max: Math.PI, step: 0.01},
// )
// pane.addBinding(
//     mesh.rotation, 'z', {min: 0, max: Math.PI, step: 0.01},
// )

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
const pointLight = new THREE.PointLight(0xFFFFFF, 1, 0, 0);
pointLight.position.z = 5
scene.add(ambientLight);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 1000);
camera.position.z = 5;

const canvas = document.getElementById('canvas-landing');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});

const rendererSize = 100;
renderer.setSize(rendererSize, rendererSize);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

const renderLoop = () => {
    const rotation = mesh.rotation.x;
    const meshXRotation = rotation.toFixed(4);

    if (meshXRotation >= 0.785) {
        canvas.setAttribute('onclick', "loadMain()");
        canvas.setAttribute('class', 'clickable');
        mesh.material.color = new THREE.Color(0x4D6B9E);

        renderer.render(scene, camera);
        return;
    } else if (meshXRotation >= 0.70) {
        mesh.rotation.x += 0.017;
    } else {
        mesh.rotation.x += 0.01;
    }

    // controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(renderLoop);
};

renderLoop();