import * as THREE from "three";
import {PlanetHelper} from "./addPlanets";
import {RayCaster} from "./rayCaster";
import {TimeHelper} from "./timeHelper";
import {ControlHelper} from "./controlHelper";
import {TextHelper} from "./textHelper";

let scene, renderer, camera, textHelper, timeHelper, planetHelper, rayCaster, controlHelper, addPlanets = false;
init();

function init() {
    //Defino cámara
    scene = new THREE.Scene();

    const loader = new THREE.CubeTextureLoader();
    loader.setPath('textures/sky/');
    scene.background = loader.load(['right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png']);

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    );
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);

    controlHelper = new ControlHelper(camera, renderer);
    timeHelper = new TimeHelper(timeHelper);
    planetHelper = new PlanetHelper(scene, timeHelper);
    planetHelper.Estrella(1.8, 0xffff00)
    const light = new THREE.PointLight(0xffffff, 2, 1000);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.02); // Soft white light
    scene.add(ambientLight);
    rayCaster = new RayCaster(scene, renderer);
    textHelper = new TextHelper(controlHelper);

    document.addEventListener("keydown", keyDown);
    document.addEventListener("mousedown", onDocumentMouseDown);
    animationLoop();
}

//Bucle de animación
function animationLoop() {
    requestAnimationFrame(animationLoop);
    planetHelper.movePlanets();
    controlHelper.updateControl();
    renderer.render(scene, camera);
}

function onDocumentMouseDown(event) {
    if (!addPlanets) return;
    rayCaster.intersect(event, camera, dist => planetHelper.randomPlanet(dist))
}

function keyDown(key) {
    switch (key.keyCode) {
        //P
        case 80: {
            addPlanets = !addPlanets;
            textHelper.addPlanets(addPlanets);
            break;
        }
        //M
        case 77: {
            controlHelper.changeControl();
            textHelper.updateText();
            break;
        }
        //L
        case 76: {
            planetHelper.deletePlanets();
            break;
        }
        //1
        case 49: {
            timeHelper.changeSpeed("YEAR");
            break;
        }
        //2
        case 50: {
            timeHelper.changeSpeed("MONTH");
            break;
        }
        //3
        case 51: {
            timeHelper.changeSpeed("WEEK");
            break;
        }
        //4
        case 52: {
            timeHelper.changeSpeed("DAY");
            break;
        }
        //1
        case 53: {
            timeHelper.changeSpeed("HOUR");
            break;
        }
    }
}