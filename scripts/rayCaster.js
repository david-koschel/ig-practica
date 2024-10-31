import * as THREE from "three";
import {Raycaster} from "three";

export class RayCaster {
    constructor(scene, renderer) {
        this._scene = scene;
        this._renderer = renderer;
        this._init();
    }

    _init() {
        this._raycaster = new Raycaster();
        const geometryp = new THREE.PlaneGeometry(200, 200);
        const materialp = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
        });
        this._plano = new THREE.Mesh(geometryp, materialp);
        this._plano.geometry.rotateX(Math.PI / 2);
        this._plano.visible = false;
        this._scene.add(this._plano);
    }

    intersect(event, camera, intersectFunc) {
        const mouse = {
            x: (event.clientX / this._renderer.domElement.clientWidth) * 2 - 1,
            y: -(event.clientY / this._renderer.domElement.clientHeight) * 2 + 1,
        };
        this._raycaster.setFromCamera(mouse, camera);
        const intersects = this._raycaster.intersectObject(this._plano);
        if (intersects.length > 0) {
            const dist = Math.sqrt(intersects[0].point.z ** 2 + intersects[0].point.x ** 2);
            intersectFunc(dist);
        }
    }
}