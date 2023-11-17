export default class PowerUp {
    constructor(ctx, x, y, type) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.type = type; // Tipo de power-up, por ejemplo, "ammo" para recarga de disparos
        this.width = 30; // Ancho del power-up
        this.height = 30; // Altura del power-up
    }

    draw() {
        // Dibuja el power-up. Puedes usar una imagen o un gráfico simple
        this.ctx.fillStyle = 'yellow'; // Color por defecto, cambia según el tipo si es necesario
        this.ctx.fillRect(this.x, this.y, this.width, this.height); // Dibuja un rectángulo simple
    }

    collectedBy(puchi) {
        // Verifica si Puchi ha recogido el power-up
        return puchi.x < this.x + this.width &&
            puchi.x + puchi.width > this.x &&
            puchi.y < this.y + this.height &&
            puchi.y + puchi.height > this.y;
    }
}