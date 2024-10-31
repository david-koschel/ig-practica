import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FlyControls} from "three/addons/controls/FlyControls";

export class ControlHelper {
    constructor(camera, render, timeHelper) {
        this._camera = camera;
        this._render = render;
        this.#startOrbitControl();
        this._t0 = new Date();
    }

    #startOrbitControl() {
        this.#removeControl();
        this._currentControl = new OrbitControls(this._camera, this._render.domElement);
        this._currentControl.controlType = "ORBIT"
    }

    #startFlyControl() {
        this.#removeControl();
        const controls = new FlyControls(this._camera, this._render.domElement);
        controls.movementSpeed = 0.001;
        controls.domElement = this._render.domElement;
        controls.rollSpeed = 0.0002;
        controls.autoForward = false;
        controls.dragToLook = false;
        controls.controlType = "FLY"
        this._currentControl = controls;
    }

    #removeControl() {
        if (!this._currentControl) return;
        this._currentControl.dispose();
    }

    updateControl() {
        if (this._currentControl.controlType === "FLY") {
            let t1 = new Date();
            let secs = (t1 - this._t0) / 1000;
            this._currentControl.update(secs);
        }
    }

    changeControl() {
        if (this._currentControl.controlType === "FLY") this.#startOrbitControl()
        else this.#startFlyControl();
    }

    pause() {

    }

    get controlType() {
        return this._currentControl.controlType;
    }
}