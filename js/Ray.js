// Ray.js
export default class Ray {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = 10; // Altura del rayo (ahora se comportará como el "largo" horizontalmente)
        this.height = 5; // Ancho del rayo
        this.color = 'yellow'; // Color del rayo
        this.velocity = 10; // Velocidad a la que el rayo se mueve hacia la derecha
    }

    update() {
        this.x += this.velocity; // Mueve el rayo hacia la derecha
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y - this.height / 2, this.width, this.height);
    }

    offScreen() {
        return this.x > this.ctx.canvas.width; // Retorna true si el rayo está fuera del canvas
    }
}
