import * as THREE from "three";

export class PlanetHelper {
    get Planetas() {
        return this._Planetas;
    }

    get Lunas() {
        return this._Lunas;
    }

    constructor(scene, timeHelper) {
        this._scene = scene;
        this._timeHelper = timeHelper;
        this._Planetas = [];
        this._Orbitas = [];
        this._Lunas = [];
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
        const geometry = new THREE.SphereGeometry(rad, 30, 30);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                texture1: {value: new THREE.TextureLoader().load("textures/sun.jpg")},
                showNight: {value: false},
            },
            vertexShader: this.vertexShader(),
            fragmentShader: this.fragmentShaderBasic(),
        });
        const estrella = new THREE.Mesh(geometry, material);
        this._scene.add(estrella);
    }

    randomPlanet(dist) {
        this.PlanetaColor(
            THREE.MathUtils.randFloat(.1, 1.5) * dist / 20,
            dist,
            THREE.MathUtils.randFloat(EARTH_TRASLATION_IN_SECOND / 5, EARTH_TRASLATION_IN_SECOND * 3),
            THREE.MathUtils.randFloat(-EARTH_ROTATION_IN_DAYS / 5, EARTH_ROTATION_IN_DAYS * 5),
            1,
            1,
            THREE.MathUtils.randInt(0, 0xffffff),
            THREE.MathUtils.randFloat(0, Math.PI * 2),
        )
    }

    PlanetaColor(radio, dist, vel, rot, f1, f2, col, offset) {
        const randomPlanetTxt = new THREE.TextureLoader().load(`textures/planet${THREE.MathUtils.randInt(1, 4)}.png`);
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                texture1: {value: randomPlanetTxt},
                color: {value: new THREE.Color(col)},
                showNight: {value: false},
            },
            vertexShader: this.vertexShader(),
            fragmentShader: this.fragmentShaderRandom(),
        });
        this._generatePlanet(mat, radio, dist, vel, rot, f1, f2, this._scene, offset)
    }

    PlanetaTexture(radio, dist, vel, rot, f1, f2, texture, texture2 = undefined) {
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                textureDay: {value: texture},
                textureNight: {value: texture2},
                showNight: {value: !!texture2},
            },
            vertexShader: this.vertexShader(),
            fragmentShader: this.fragmentShader(),
        });

        return this._generatePlanet(mat, radio, dist, vel, rot, f1, f2, this._scene)
    }

    _generatePlanet(mat, radio, dist, vel, rot, f1, f2, parent, offset = 0) {
        const geom = new THREE.SphereGeometry(radio, 30, 30);


        const planetMesh = new THREE.Mesh(geom, mat);

        planetMesh.userData.dist = dist;
        planetMesh.userData.speed = vel;
        planetMesh.userData.rotation = rot;
        planetMesh.userData.f1 = f1;
        planetMesh.userData.f2 = f2;
        planetMesh.userData.offset = offset;

        this._Planetas.push(planetMesh);
        parent.add(planetMesh);

        const curve = new THREE.EllipseCurve(0, 0, dist * f1, dist * f2);
        const points = curve.getPoints(500);
        const geome = new THREE.BufferGeometry().setFromPoints(points);
        const mate = new THREE.LineBasicMaterial({color: 0xffffff});
        const orbita = new THREE.Line(geome, mate);
        orbita.geometry.rotateX(Math.PI / 2);
        this._Orbitas.push(orbita);
        this._scene.add(orbita);

        return planetMesh;
    }

    Luna(planeta, radio, dist, vel, map, angle) {
        const pivote = new THREE.Object3D();
        pivote.rotation.x = angle;
        planeta.add(pivote);
        const geom = new THREE.SphereGeometry(radio, 50, 50);
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                textureDay: {value: map},
                showNight: {value: false},
            },
            vertexShader: this.vertexShader(),
            fragmentShader: this.fragmentShader(),
        });
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
        const earthTexture2 = new THREE.TextureLoader().load("textures/earth_night.jpg");
        const lunaTexture = new THREE.TextureLoader().load("textures/luna.jpg");
        const marsTexture = new THREE.TextureLoader().load("textures/mars.jpg");
        const jupiterTexture = new THREE.TextureLoader().load("textures/jupiter.jpg");

        this.PlanetaTexture(.2440, 4.6, EARTH_TRASLATION_IN_SECOND * 4.15, EARTH_ROTATION_IN_DAYS * 0.011, 1.0, 1.0, mercuryTexture);
        this.PlanetaTexture(.6051, 10.8, EARTH_TRASLATION_IN_SECOND * 1.62, EARTH_ROTATION_IN_DAYS * -0.00411, 1.0, 1.0, venusTexture);
        const tierra = this.PlanetaTexture(.6371, 15, EARTH_TRASLATION_IN_SECOND, EARTH_ROTATION_IN_DAYS, 1.0, 1.0, earthTexture, earthTexture2);
        this.Luna(tierra, .17374, 1.844, 0.00040, lunaTexture, 20)
        this.PlanetaTexture(.33895, 22.8, EARTH_TRASLATION_IN_SECOND * 0.4876, EARTH_ROTATION_IN_DAYS * 0.9732, 1.0, 1.0, marsTexture);
        this.PlanetaTexture(6.9911, 75, EARTH_TRASLATION_IN_SECOND * 0.07732, EARTH_ROTATION_IN_DAYS * 2.4, 1.0, 1.0, jupiterTexture);
    }

    movePlanets() {
        const timestamp = this._timeHelper.getTimestamp()
        for (let object of this.Planetas) {
            object.position.x =
                Math.cos(timestamp * object.userData.speed + object.userData.offset) *
                object.userData.f1 *
                object.userData.dist;
            object.position.z =
                Math.sin(timestamp * object.userData.speed + object.userData.offset) *
                object.userData.f2 *
                object.userData.dist;

            object.rotation.y = object.userData.rotation * timestamp;
        }

        for (let object of this.Lunas) {
            object.position.x =
                Math.cos(timestamp * object.userData.speed) * object.userData.dist;
            object.position.z =
                Math.sin(timestamp * object.userData.speed) * object.userData.dist;
        }
    }

    vertexShader() {
        return `
            varying vec2 vUv;
            varying vec3 v_Normal;
            varying vec3 v_Luz;
        
            void main() {
              vUv = uv;
              
              vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        
              vec4 viewLightPos = viewMatrix * vec4(0, 0 , 0, 1.0); // Transformar posición de la luz
              v_Normal = normalize(normalMatrix * normal);
              v_Luz = normalize(viewLightPos.xyz - modelViewPosition.xyz); // Vector hacia la luz
        
              gl_Position = projectionMatrix * modelViewPosition;
            }
        `;
    }

    fragmentShaderBasic() {
        return `
            uniform sampler2D texture1;
        
            varying vec2 vUv;
        
            void main() {
                vec4 texColor = texture2D(texture1, vUv);
                vec3 brightColor = texColor.rgb * 1.5;
                gl_FragColor = vec4(brightColor, texColor.a);
            }
        `;
    }

    fragmentShaderRandom() {
        return `
           uniform sampler2D texture1;
           uniform vec3 color;
        
            varying vec2 vUv;
            varying vec3 v_Normal;
            varying vec3 v_Luz;
        
            void main() {
              float LdotN = max(dot(v_Luz, v_Normal), 0.0) * 1.55;
              float threshold = 0.1;
              vec3 color = texture2D(texture1, vUv).rgb * color * max(LdotN, threshold);
              gl_FragColor = vec4(color, 1.0);
            }
        `;
    }

    fragmentShader() {
        return `
            uniform sampler2D textureDay;
            uniform sampler2D textureNight;
            uniform bool showNight;
        
            varying vec2 vUv;
            varying vec3 v_Normal;
            varying vec3 v_Luz;
        
            void main() {
              float LdotN = max(dot(v_Luz, v_Normal), 0.0) * 1.55;
        
              float threshold = 0.1;
              vec3 color;
              if (!showNight || LdotN > threshold) {
                color = texture2D(textureDay, vUv).rgb * max(LdotN, threshold);
              } else {
                color = texture2D(textureNight, vUv).rgb * (1.0 - threshold);
              }
              gl_FragColor = vec4(color, 1.0);
            }
        `;
    }

}

const EARTH_TRASLATION_IN_SECOND = Math.PI * 2 / (365 * 86400);
const EARTH_ROTATION_IN_DAYS = Math.PI * 2 / 86400;