export default class Puchi {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        this.x = x;
        this.y = y;
        this.velocity = {x: 0, y: 0};
        this.acceleration = {x: 0, y: 0};
        this.maxSpeed = 5;
        this.accelerationRate = 0.2; // How quickly Puchi speeds up
        this.spriteNatural = new Image();
        this.spriteNatural.src = 'images/puchi-retro-150.png';
        this.spriteWhenFlashing = new Image();
        this.spriteWhenFlashing.src = 'images/puchi-ammo-powerup-150.png';
        this.loaded = false;
        this.spriteNatural.onload = () => {
            this.loaded = true;
            this.width = this.spriteNatural.naturalWidth;
            this.height = this.spriteNatural.naturalHeight;
            this.draw();
        };
        this.loaded = false;
        this.shotsLeft = 50; // Puchi comienza con 50 disparos
        //Effect when getting an Ammo PowerUp
        this.isFlashing = false;
        this.flashDuration = 500; // Duración del destello en milisegundos
        this.flashTimer = 0;
    }

    // Método para disparar
    shoot() {
        if (this.shotsLeft == 0) return;

        this.shotsLeft--;
        // Lógica para disparar un rayo...
        return true; // Disparo exitoso
    }

    draw() {
        if (!this.loaded) return;

        let imgToDraw = this.isFlashing && this.spriteWhenFlashing.complete ? this.spriteWhenFlashing : this.spriteNatural;
        this.ctx.drawImage(imgToDraw, this.x, this.y, imgToDraw.width, imgToDraw.height);

        if (window.gameConfig.debugMode) {
            this.ctx.strokeStyle = 'green'; // Elige un color que destaque
            this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    update(deltaTime) {
        // Increase velocity based on acceleration, but clamp it at maxSpeed
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        this.velocity.x = Math.sign(this.velocity.x) * Math.min(Math.abs(this.velocity.x), this.maxSpeed);
        this.velocity.y = Math.sign(this.velocity.y) * Math.min(Math.abs(this.velocity.y), this.maxSpeed);

        // Actualiza la posición de Puchi basada en la velocidad
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Restringe a Puchi dentro del canvas
        this.checkBounds();

        // ...actualizaciones existentes...
        if (this.isFlashing) {
            this.flashTimer += deltaTime;
            if (this.flashTimer > this.flashDuration) {
                this.isFlashing = false;
            }
        }
    }

    checkBounds() {
        // Límite izquierdo
        if (this.x < 0) {
            this.x = 0;
        }
        // Límite derecho
        if (this.x + this.width > this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.width;
        }
        // Límite superior
        if (this.y < 0) {
            this.y = 0;
        }
        // Límite inferior
        if (this.y + this.height > this.ctx.canvas.height) {
            this.y = this.ctx.canvas.height - this.height;
        }
    }

    setAcceleration(directionX, directionY) {
        this.acceleration.x = directionX * this.accelerationRate;
        this.acceleration.y = directionY * this.accelerationRate;
    }

    // Método para iniciar el destello
    startFlash() {
        this.isFlashing = true;
        this.flashTimer = 0;
    }

    getRayOrigin() {
        // Calcula el origen del rayo basándose en la imagen actual de Puchi
        const currentImage = this.isFlashing && this.spriteWhenFlashing.complete ? this.spriteWhenFlashing : this.spriteNatural;
        return {
            x: this.x + currentImage.width / 2,
            y: this.y + currentImage.height / 2
        };
    }
}