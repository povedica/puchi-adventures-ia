export default class Puchi {
    constructor(ctx, x, y, spritePath) {
        this.ctx = ctx;
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        this.x = x;
        this.y = y;
        this.velocity = {x: 0, y: 0};
        this.acceleration = {x: 0, y: 0};
        this.maxSpeed = 5;
        this.accelerationRate = 0.1; // How quickly Puchi speeds up
        this.sprite = new Image();
        this.sprite.src = spritePath;
        this.loaded = false;
        this.sprite.onload = () => {
            this.loaded = true;
            this.width = this.sprite.naturalWidth;
            this.height = this.sprite.naturalHeight;
            this.draw();
        };
        this.loaded = false;
    }

    draw() {
        if (!this.loaded) return;

        this.ctx.drawImage(this.sprite, this.x - this.width / 2, this.y - this.height / 2, this.width,this.height);
    }

    update() {
        // Increase velocity based on acceleration, but clamp it at maxSpeed
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        this.velocity.x = Math.sign(this.velocity.x) * Math.min(Math.abs(this.velocity.x), this.maxSpeed);
        this.velocity.y = Math.sign(this.velocity.y) * Math.min(Math.abs(this.velocity.y), this.maxSpeed);

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    setAcceleration(directionX, directionY) {
        this.acceleration.x = directionX * this.accelerationRate;
        this.acceleration.y = directionY * this.accelerationRate;
    }
}