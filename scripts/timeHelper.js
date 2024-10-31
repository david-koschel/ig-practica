const ONE_DAY_PER_SECOND = 86400;
const ONE_YEAR_PER_SECOND = ONE_DAY_PER_SECOND * 365.25

export class TimeHelper {
    constructor() {
        this.changeSpeed("DAY");
        this._prevTime = Date.now();
        this._time = 0;
    }

    getTimestamp(logDays = false) {
        const now = Date.now();
        const elapsedTime = (now - this._prevTime) / 1000;
        const newTime = this._time + elapsedTime * this.getAcc();
        if (logDays) console.log("DAYS:", newTime / 86400);
        this._time = newTime;
        this._prevTime = now;
        return newTime;
    }

    changeSpeed(duration) {
        this._currentSpeed = duration.toUpperCase();
    }

    getAcc() {
        switch (this._currentSpeed) {
            case "YEAR":
                return ONE_YEAR_PER_SECOND;
            case "MONTH":
                return ONE_YEAR_PER_SECOND / 12;
            case "WEEK":
                return ONE_DAY_PER_SECOND * 7;
            case "DAY":
                return ONE_DAY_PER_SECOND;
            case "HALF_DAY":
                return ONE_DAY_PER_SECOND / 2;
            case "HOUR":
                return ONE_DAY_PER_SECOND / 24;
            default:
                return 0;
        }
    }
}
