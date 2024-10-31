import * as THREE from "three";

export class PlanetHelper {
    get Planetas() {
        return this._Planetas;
    }

    get Orbitas() {
        return this._Orbitas;
    }

    get Lunas() {
        return this._Lunas;
    }

    get Rings() {
        return this._Rings;
    }

    constructor(scene, timeHelper) {
        this._scene = scene;
        this._timeHelper = timeHelper;
        this._Planetas = [];
        this._Orbitas = [];
        this._Lunas = [];
        this._Rings = [];
        this._init();
    }

    deletePlanets() {
        for (let p of this._Planetas) {
            this._scene.remove(p);
        }
        for (let o of this._Orbitas) {
            this._scene.remove(o);
        }
        this._Planetas = [];
        this._Orbitas = [];
    }

    Estrella(rad) {
        let geometry = new THREE.SphereGeometry(rad, 30, 30);
        let material = new THREE.MeshBasicMaterial({color: 0xffffff});
        material.map = new THREE.TextureLoader().load("textures/sun.jpg");
        const estrella = new THREE.Mesh(geometry, material);
        this._scene.add(estrella);

        // let geometry2 = new THREE.SphereGeometry(1000, 30, 30);
        // let material2 = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BackSide});
        // material2.map =
        // const estrella2 = new THREE.Mesh(geometry2, material2);
        // this._scene.add(estrella2);
    }

    randomPlanet(dist) {
        this.PlanetaColor(
            THREE.MathUtils.randFloat(.1, .8),
            dist,
            THREE.MathUtils.randFloat(-3, 3),
            THREE.MathUtils.randFloat(-3, 3),
            1,
            1,
            THREE.MathUtils.randInt(0, 0xffffff)
        )
    }

    PlanetaColor(radio, dist, vel, rot, f1, f2, col = 0xffffff) {
        const mat = new THREE.MeshPhongMaterial({
            color: col,
        });
        this._generatePlanet(mat, radio, dist, vel, rot, f1, f2, this._scene)
    }

    PlanetaTexture(radio, dist, vel, rot, f1, f2, texture = undefined, alpha = undefined) {
        let mat = new THREE.MeshPhongMaterial({
            color: 0xffffff
        });

        if (texture !== undefined) {
            mat.map = texture;
        }

        if (alpha !== undefined) {
            mat.map = alpha;
            mat.transparent = true;
            mat.side = THREE.DoubleSide;
            mat.opacity = 1;
        }

        return this._generatePlanet(mat, radio, dist, vel, rot, f1, f2, this._scene)
    }

    _generatePlanet(mat, radio, dist, vel, rot, f1, f2, parent) {
        const geom = new THREE.SphereGeometry(radio, 30, 30);
        const planetMesh = new THREE.Mesh(geom, mat);

        planetMesh.userData.dist = dist;
        planetMesh.userData.speed = vel;
        planetMesh.userData.rotation = rot;
        planetMesh.userData.f1 = f1;
        planetMesh.userData.f2 = f2;

        this._Planetas.push(planetMesh);
        parent.add(planetMesh);

        //Dibuja trayectoria, con
        let curve = new THREE.EllipseCurve(
            0,
            0, // centro
            dist * f1,
            dist * f2 // radios elipse
        );
        //Crea geometría
        const points = curve.getPoints(500);
        const geome = new THREE.BufferGeometry().setFromPoints(points);
        const mate = new THREE.LineBasicMaterial({color: 0xffffff});
        // Objeto
        const orbita = new THREE.Line(geome, mate);
        orbita.geometry.rotateX(Math.PI / 2);
        this._Orbitas.push(orbita)
        this._scene.add(orbita);
        return planetMesh;
    }

    Luna(planeta, radio, dist, vel, map, angle) {
        const pivote = new THREE.Object3D();
        pivote.rotation.x = angle;
        planeta.add(pivote);
        const geom = new THREE.SphereGeometry(radio, 50, 50);
        const mat = new THREE.MeshPhongMaterial({map});
        const luna = new THREE.Mesh(geom, mat);
        luna.userData.dist = dist;
        luna.userData.speed = vel;

        this._Lunas.push(luna);
        pivote.add(luna);
    }

    _init() {
        const mercuryTexture = new THREE.TextureLoader().load("textures/mercury.jpg");
        const venusTexture = new THREE.TextureLoader().load("textures/venus.jpg");
        const earthTexture = new THREE.TextureLoader().load("textures/earth.jpg");
        const lunaTexture = new THREE.TextureLoader().load("textures/luna.jpg");
        const marsTexture = new THREE.TextureLoader().load("textures/mars.jpg");
        const jupiterTexture = new THREE.TextureLoader().load("textures/jupiter.jpg");
        // const saturnTexture = new THREE.TextureLoader().load("textures/saturn.jpg");

        this.PlanetaTexture(.2440, 4.6, EARTH_TRASLATION_IN_SECOND * 4.15, EARTH_ROTATION_IN_DAYS * 0.011, 1.0, 1.0, mercuryTexture);
        this.PlanetaTexture(.6051, 10.8, EARTH_TRASLATION_IN_SECOND * 1.62, EARTH_ROTATION_IN_DAYS * -0.00411, 1.0, 1.0, venusTexture);
        const tierra = this.PlanetaTexture(.6371, 15, EARTH_TRASLATION_IN_SECOND, EARTH_ROTATION_IN_DAYS, 1.0, 1.0, earthTexture);
        this.Luna(tierra, .17374, 1.844, .001, lunaTexture, 10)
        this.PlanetaTexture(.33895, 22.8, EARTH_TRASLATION_IN_SECOND * 0.4876, EARTH_ROTATION_IN_DAYS * 0.9732, 1.0, 1.0, marsTexture);
        this.PlanetaTexture(6.9911, 75, EARTH_TRASLATION_IN_SECOND * 0.07732, EARTH_ROTATION_IN_DAYS * 2.4, 1.0, 1.0, jupiterTexture);
        // this.PlanetaTexture(5.8232, 141.8, EARTH_TRASLATION * 0.03389, EARTH_ROTATION_IN_DAYS * 2.3452, 1.0, 1.0, saturnTexture);
    }

    movePlanets() {
        const timestamp = this._timeHelper.getTimestamp()
        for (let object of this.Planetas) {
            object.position.x =
                Math.cos(timestamp * object.userData.speed) *
                object.userData.f1 *
                object.userData.dist;
            object.position.z =
                Math.sin(timestamp * object.userData.speed) *
                object.userData.f2 *
                object.userData.dist;

            object.rotation.y = this._timeHelper.getRotation(object.userData.rotation);
        }

        for (let object of this.Lunas) {
            object.position.x =
                Math.cos(timestamp * object.userData.speed) * object.userData.dist;
            object.position.z =
                Math.sin(timestamp * object.userData.speed) * object.userData.dist;
        }
    }
}

const EARTH_TRASLATION_IN_SECOND = Math.PI * 2 / (365 * 86400);
const EARTH_ROTATION_IN_DAYS = Math.PI * 2;