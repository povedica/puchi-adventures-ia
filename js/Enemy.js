// Enemigo.js
export default class Enemy {
    constructor(ctx, canvasWidth, canvasHeight, spritePath) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.sprite = new Image();
        this.sprite.src = spritePath;
        this.width = 50; // Asume un ancho predeterminado, ajusta según el tamaño de tu sprite
        this.height = 50; // Asume una altura predeterminada, ajusta según el tamaño de tu sprite
        this.x = canvasWidth; // Empieza en el borde derecho del canvas
        this.y = Math.random() * (canvasHeight - this.height); // Posición aleatoria en el eje Y
        this.speedX = -2; // Velocidad horizontal negativa para moverse hacia la izquierda
        this.speedY = (Math.random() - 0.5) * 2; // Velocidad vertical aleatoria
        this.isAlive = false;
        this.sprite = new Image();
        this.sprite.src = spritePath;
        this.sprite.onload = () => {
            this.isAlive = true;
            this.width = this.sprite.naturalWidth;
            this.height = this.sprite.naturalHeight;
            this.draw();
        };
    }

    update() {
        // Actualiza la posición del enemigo
        this.x += this.speedX;
        this.y += this.speedY;

        // Mantener al enemigo dentro del canvas en el eje vertical
        if (this.y <= 0 || this.y + this.height >= this.canvasHeight) {
            this.speedY = -this.speedY;
        }
    }

    draw() {
        if (!this.isAlive) return;

        // Dibuja el sprite del enemigo si está vivo
        //this.ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        this.ctx.drawImage(this.sprite, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    hitByRay() {
        // Marcar al enemigo como muerto si es alcanzado por un rayo
        this.isAlive = false;
    }

    offScreen() {
        // Comprueba si el enemigo ha salido completamente del lado izquierdo
        return this.x + this.width < 0;
    }
}
