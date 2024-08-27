import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { Pane } from "tweakpane";

class Building extends THREE.Mesh {
    constructor() {
        super();
        this.geometry = new THREE.BoxGeometry();
        this.material = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x900090).convertSRGBToLinear() });
    }

    onPointerOver(e) {
        this.material.color.set('hotpink');
        this.material.color.convertSRGBToLinear();
    }

    onPointerOut(e) {
        this.material.color.set(0x900090);
        this.material.color.convertSRGBToLinear();
    }
}

// params
// const pane = new Pane();

// setup
const scene = new THREE.Scene();

// const texture = new THREE.TextureLoader().load("./textures/cube/bg.jpg");
// scene.background = texture;
scene.background = new THREE.Color(0x9E009E);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersects = [];
let hovered = {};

let width = window.innerWidth;
let height = window.innerHeight;

// axes helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

// helper functions
const createBuilding = (xScale, yScale, zScale, xPos = 0, zPos = 0) => {
    const geometry = new THREE.BoxGeometry(xScale, yScale, zScale);
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(xPos, yScale, zPos);
    return mesh;
}

// initialize the geometry
const planeGeometry = new THREE.PlaneGeometry(1, 1);

// initialize the materials
const floorMaterial = new THREE.MeshStandardMaterial();
const material = new THREE.MeshStandardMaterial();

// pane.addBinding(
//     material, 'shininess', {min: 1, max: 100, step: 1}
// )

// initialize the mesh
// const mesh = new THREE.Mesh(building1, material);
// mesh.material.color = new THREE.Color(0x900090);

const building1 = createBuilding(1, 2, 1);
scene.add(building1);

const building2 = new Building();
building2.position.set(-1.5, 0, 0);
scene.add(building2);

const floor = new THREE.Mesh(planeGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
// floor.material.side = THREE.DoubleSide;
floor.scale.set(20, 20);
floor.material.color = new THREE.Color(0x150F1E);

// scene.add(mesh);
scene.add(floor);

// initialize the light
// const ambientLight = new THREE.AmbientLight(0xFFFFFF, 5);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xFFFFFF, 10);
// pointLight.position.set(5, 5, 5);
// scene.add(pointLight);

const hemisphereLight = new THREE.HemisphereLight(0x9E009E, 0x150F1E, 5);
scene.add(hemisphereLight);

THREE.light

// initialize the camera
const camera = new THREE.PerspectiveCamera(
    35, 
    window.innerWidth / window.innerHeight,
    0.1,
    200
);
camera.position.z = 5;
camera.position.y = 5;

// initialize the renderer
const canvas = document.getElementById('canvas-main');
const renderer = new THREE.WebGLRenderer({
canvas: canvas,
antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new MapControls(camera, canvas);
controls.enableDamping = true;
// controls.autoRotate = true;
// controls.enableZoom = false;
// controls.enableRotate = false;

controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.PAN,
}

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('pointermove', (e) => {
    mouse.set((e.clientX / width) * 2 - 1, - (e.clientY / height) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(scene.children, true);

    Object.keys(hovered).forEach((key) => {
        const hit = intersects.find((hit) => hit.object.uuid === key);
        if (hit === undefined) {
            const hoveredItem = hovered[key];
            if (hoveredItem.object.onPointerOver) hoveredItem.object.onPointerOut(hoveredItem);
            delete hovered[key];
        }
    })

    intersects.forEach((hit) => {
        if (!hovered[hit.object.uuid]) {
            hovered[hit.object.uuid] = hit;
            if (hit.object.onPointerOver) hit.object.onPointerOver(hit);
        }
        if (hit.object.onPointerMove) hit.object.onPointerMove(hit);
    })
})

const renderLoop = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(renderLoop);
};

renderLoop();