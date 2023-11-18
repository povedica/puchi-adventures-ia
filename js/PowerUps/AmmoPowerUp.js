import PowerUp from '../PowerUp.js';

export default class AmmoPowerUp extends PowerUp {
    constructor(ctx, x, y) {
        super(ctx, x, y, 'AmmoPowerUp'); // Tamaño del PowerUp de recarga
        this.image = new Image();
        this.image.src = 'images/ammo-powerup-100.png';
        this.width = 100; // Ancho del power-up
        this.height = 100; // Altura del power-up
    }

    draw() {
        // Asegúrate de que la imagen esté cargada antes de dibujarla
        if (this.image.complete) {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    activate(puchi) {
        puchi.shotsLeft += 50; // Recarga 50 disparos
    }
}
