import PowerUp from '../PowerUp.js';

export default class AmmoPowerUp extends PowerUp {
    constructor(ctx, x, y) {
        super(ctx, x, y, 'AmmoPowerUp'); // Tamaño del PowerUp de recarga
        this.image = new Image();
        this.image.src = 'images/ammo-powerup-100.png';
        this.width = 100; // Ancho del power-up
        this.height = 100; // Altura del power-up
        this.totalDuration = 10000; // Total: 10 segundos
        this.blinkStart = 7000; // Comienza a parpadear después de 7 segundos
        this.elapsedTime = 0; // Tiempo transcurrido
        this.isBlinking = false; // Estado de parpadeo
        this.toBeRemoved = false; // Indica si debe ser eliminado
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.width;
        this.offscreenCanvas.height = this.height;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
    }

    update(deltaTime) {
        this.elapsedTime += deltaTime;
        if (this.elapsedTime >= this.blinkStart && this.elapsedTime < this.totalDuration) {
            this.isBlinking = true;
        } else if (this.elapsedTime >= this.totalDuration) {
            this.toBeRemoved = true; // Marcar para eliminación
        }
    }

    draw() {
        this.offscreenCtx.clearRect(0, 0, this.width, this.height);

        if (this.isBlinking) {
            // Crear un efecto de parpadeo modificando la opacidad
            let alpha = (Math.sin(this.elapsedTime / 150) + 1) / 2; // Oscila entre 0 y 1
            this.offscreenCtx.globalAlpha = alpha * 0.5 + 0.5; // Oscila entre 0.5 y 1
        } else {
            this.offscreenCtx.globalAlpha = 1;
        }

        this.offscreenCtx.drawImage(this.image, 0, 0, this.width, this.height);

        this.ctx.drawImage(this.offscreenCanvas, this.x, this.y);
    }

    removeSelf() {
        // Eliminar el elemento del DOM y cualquier otra limpieza necesaria
        this.galaxy.removeChild(this.element);
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
