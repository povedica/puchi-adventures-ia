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

    handlePowerUp(puchi) {
        // Aquí manejas lo que sucede cuando Puchi recolecta un power-up
        puchi.shotsLeft += 50; // Recarga los disparos
        puchi.startFlash(); // Inicia el efecto de destello en Puchi
        this.startFlashOnShotsLeftDisplay(puchi); // Inicia el efecto de destello en el marcador de disparos
    }

    startFlashOnShotsLeftDisplay(puchi) {
        const shotsLeftDisplay = document.getElementById('shotsLeftCount');
        shotsLeftDisplay.classList.add('flash'); // Añade una clase que define el efecto de destello

        // Elimina la clase después de la duración del destello
        setTimeout(() => {
            shotsLeftDisplay.classList.remove('flash');
        }, puchi.flashDuration);
    }
}
