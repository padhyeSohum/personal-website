import * as THREE from "three";
import { Pane } from "tweakpane";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// setup
const scene = new THREE.Scene();
const loader = new GLTFLoader();
let counter = 0;

scene.add(new THREE.AxesHelper(2));

// camera
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);
// camera.position.z = 5;
let newCameraY = 0;

// background
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial());
plane.position.z = -2
// plane.scale.x = Math.tan(70) * (camera.position.z - plane.position.z) * 2;
plane.scale.x = 10;
plane.scale.y = 10;
// scene.add(plane);


// lighting
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 10, 10, 2);
pointLight.position.z = 5;
scene.add(pointLight);

// classes
class Floor extends THREE.Group {
    constructor (height) {
        super();
        this.height = height;
        const roomScale = [20, 0.1, 20]
        const elevatorSize = 7;

        const geometry = new THREE.BoxGeometry();
        const planeGeometry = new THREE.PlaneGeometry();
        const material = new THREE.MeshStandardMaterial();

        const ceiling = new THREE.Mesh(geometry, material);
        const floorPiece1 = new THREE.Mesh(geometry, material);
        floorPiece1.scale.set((roomScale[0]-elevatorSize)/2, roomScale[1], roomScale[2])
        floorPiece1.position.x = -(elevatorSize+floorPiece1.scale.x)/2;

        const floorPiece2 = new THREE.Mesh(geometry, material);
        floorPiece2.scale.set(elevatorSize, roomScale[1], (roomScale[2]-elevatorSize)/2);
        floorPiece2.position.z = (elevatorSize+floorPiece2.scale.z)/2;

        const floorPiece3 = new THREE.Mesh(geometry, material);
        floorPiece3.scale.set((roomScale[0]-elevatorSize)/2, roomScale[1], roomScale[2])
        floorPiece3.position.x = (elevatorSize+floorPiece3.scale.x)/2;

        const floorPiece4 = new THREE.Mesh(geometry, material);
        floorPiece4.scale.set(elevatorSize, roomScale[1], (roomScale[2]-elevatorSize)/2);
        floorPiece4.position.z = -(elevatorSize+floorPiece4.scale.z)/2;

        const floor = new THREE.Group();
        floor.add(floorPiece1)
        floor.add(floorPiece2)
        floor.add(floorPiece3)
        floor.add(floorPiece4)

        ceiling.scale.set(...roomScale);

        ceiling.position.y = this.height/2;
        floor.position.y = -this.height/2;

        this.add(ceiling);
        this.add(floor);

        // const walls = new THREE.Group();
        // const wall1 = new THREE.Mesh(planeGeometry, material);
        // wall1.position.z = -5;

        // const wall2 = new THREE.Mesh(planeGeometry, material);
        // wall2.position.x = 5;
        // // wall2.rotation.x = 
        // const wall3 = new THREE.Mesh(planeGeometry, material);
        // const wall4 = new THREE.Mesh(planeGeometry, material);

        // walls.add(wall1);
        // walls.add(wall2);
        // walls.add(wall3);
        // walls.add(wall4);
    }
}


// init
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial();
// const mesh = new THREE.Mesh(geometry, material);

// scene.add(mesh);

// room
const ceiling = new THREE.Mesh(geometry, material);
const floor = new THREE.Mesh(geometry, material);

ceiling.scale.set(10, 0.1, 4);
floor.scale.set(ceiling.scale.x, ceiling.scale.y, ceiling.scale.z);

ceiling.position.y = 1;
floor.position.y = -1;

// scene.add(ceiling);
// scene.add(floor);
const floor1 = new Floor(4);
scene.add(floor1);

// renderer
const canvas = document.getElementById('canvas-main');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// event listeners
onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

onwheel = (event) => {
    camera.zoom += event.deltaY * -0.001;
    // camera.zoom = Math.max(0.4, camera.zoom);
    camera.updateProjectionMatrix();
};

onkeydown = (event) => {
    let key = event.key;
    let yTranslation = 0;
    let yRotation = 0;
    switch (key) {
        case "ArrowUp":
            yTranslation = 1;
            break;
        case "ArrowDown":
            yTranslation = -1;
            break;
        case "ArrowLeft":
            yRotation = 90;
            break;
        case "ArrowRight":
            yRotation = -90;
            break;
    }

    camera.position.y += yTranslation;
    camera.rotation.y += THREE.MathUtils.degToRad(yRotation);
}

const renderLoop = () => {
    renderer.render(scene, camera);
    window.requestAnimationFrame(renderLoop);
};

renderLoop();