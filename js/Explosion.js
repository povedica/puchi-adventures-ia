export default class Explosion {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = 1; // Iniciar con un radio pequeño
        this.maxRadius = 30; // Radio máximo de la explosión
        this.lifeSpan = 500; // Duración de la explosión en milisegundos
        this.age = 0; // Tiempo actual de la explosión
    }

    update(deltaTime) {
        this.age += deltaTime; // deltaTime ya está en segundos
        if (!this.isAlive()) return;

        this.radius += (this.maxRadius / this.lifeSpan) * deltaTime;
    }

    draw() {
        if (!this.isAlive()) return;

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'rgba(255, 69, 0, ' + (1 - this.age / this.lifeSpan) + ')';
        this.ctx.fill();
    }

    isAlive() {
        return this.age < this.lifeSpan;
    }
}
