import Star from './Star.js';
import ShootingStar from './ShootingStar.js';

export default class Galaxy {
    constructor(galaxyElementId) {
        this.galaxy = document.getElementById(galaxyElementId);
        this.init();
    }

    init() {
        for (let i = 0; i < 200; i++) {
            new Star(this.galaxy);
        }

        setInterval(() => new ShootingStar(this.galaxy), 2000);
    }
}