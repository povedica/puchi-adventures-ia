import PowerUp from '../PowerUp.js';

export default class AmmoPowerUp extends PowerUp {
    constructor(ctx, x, y) {
        super(ctx, x, y, 30, 30); // Tamaño del PowerUp de recarga
    }

    draw() {
        this.ctx.fillStyle = 'yellow'; // Color del PowerUp de recarga
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    activate(puchi) {
        puchi.shotsLeft += 50; // Recarga 50 disparos
    }
}
