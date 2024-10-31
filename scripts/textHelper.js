const addPlanetsOff = "P -> entrar al modo añadir planetas"
const addPlanetsOn = "P -> salir del modo añadir planetas"
const removePlanets = "L -> eliminar todos los planetas"
const orbitCamera = "M -> cambiar vista a nave"
const flyCamera = "M -> cambiar vista a dios"
const time = "Velocidad / SEG | 1 -> Año | 2 -> Mes | 3 -> Semana | 4 -> Día | 5 -> Hora"

export class TextHelper {
    #text = ""
    #planet = addPlanetsOff

    constructor(controlHelper) {
        this._controlHelper = controlHelper;
        this.#init();
    }

    #init() {
        this._info = document.createElement("div");
        this._info.style.position = "absolute";
        this._info.style.top = "30px";
        this._info.style.left = "50%";
        this._info.style.transform = "translateX(-50%)";
        this._info.style.textAlign = "center";
        this._info.style.color = "#fff";
        this._info.style.fontWeight = "bold";
        this._info.style.backgroundColor = "black";
        this._info.style.zIndex = "1";
        this._info.style.fontFamily = "Monospace";
        this._info.style.opacity = "0.8";

        this.updateText();
        document.body.appendChild(this._info);
    }

    updateText() {
        this.#text = "";
        this.#addLine("--------CONTROLES--------");
        this.#addLine(time);
        this.#addLine(this.#planet);
        this.#addLine(removePlanets);
        this.#addControlLine();
        this._info.innerHTML = this.#text;
    }

    #addControlLine() {
        if (this._controlHelper.controlType === "FLY") this.#addLine(flyCamera)
        else if (this._controlHelper.controlType === "ORBIT") this.#addLine(orbitCamera)
    }

    #addLine(txt) {
        this.#text += txt;
        this.#text += "</br>";
    }

    addPlanets(add) {
        this.#planet = add ? addPlanetsOn : addPlanetsOff;
        this.updateText()
    }
}