import Puchi from './Puchi.js';
import Ray from './Ray.js';

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = 664;   /// use integer values
        this.canvas.height = 980;
        this.ctx = this.canvas.getContext('2d');
        this.keys = {ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false};
        this.bindKeyboardEvents();
        this.running = false;
        this.rays = [];
    }

    bindKeyboardEvents() {
        window.addEventListener('keydown', (event) => this.handleKeyUpDown(event,true));
        window.addEventListener('keyup', (event) => this.handleKeyUpDown(event,false));
    }

    handleKeyUpDown(event,active_key) {
        const key = event.key.toLowerCase();
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
            this.keys[key] = active_key;
        }
        if (event.code === 'Space' && this.running) {
            this.shootRays();
        }
    }

    shootRays() {
        // Crea un nuevo rayo en la posición de Puchi
        this.rays.push(new Ray(this.ctx, this.puchi.x, this.puchi.y + 20 - this.puchi.height / 2));
    }

    loop() {
        requestAnimationFrame(() => this.loop());
        this.update();
        this.render();
    }

    start() {
        this.running = true;
        let position_x = this.canvas.width / 2;
        let position_y = this.canvas.height / 2;
        // Asegúrate de que los valores `x` e `y` son los correctos para la posición inicial de Puchi
        this.puchi = new Puchi(
            this.ctx,
            position_x,
            position_y,
            'images/puchi-50.png'
        );
        requestAnimationFrame(() => this.gameLoop());
    }

    gameLoop() {
        if (!this.running) return;
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Actualiza el estado del juego
        if (this.puchi) {
            // Solo actualiza a Puchi si existe
            this.handlePuchiMovement();
            this.puchi.update();
        }
        // Actualizar la posición de los rayos
        this.rays = this.rays.filter(ray => {
            ray.update();
            return !ray.offScreen(); // Filtra los rayos que aún están en pantalla
        });
    }

    render() {
        // Clear the canvas and render game objects
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.puchi.draw();
        this.rays.forEach(ray => ray.draw());
    }

    handlePuchiMovement() {
        // Reset acceleration when no keys are pressed
        let directionX = 0;
        let directionY = 0;

        // Check which keys are pressed for horizontal movement
        if (this.keys['a'] || this.keys['arrowleft']) {
            directionX = -1;
        } else if (this.keys['d'] || this.keys['arrowright']) {
            directionX = 1;
        }

        // Check which keys are pressed for vertical movement
        if (this.keys['w'] || this.keys['arrowup']) {
            directionY = -1;
        } else if (this.keys['s'] || this.keys['arrowdown']) {
            directionY = 1;
        }

        // Update acceleration based on the keys pressed
        this.puchi.setAcceleration(directionX, directionY);
    }


}

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game('gameCanvas');
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        game.start();
    });
});
