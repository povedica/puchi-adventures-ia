import Puchi from './Puchi.js';
import Ray from './Ray.js';
import Enemy from "./Enemy.js";

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
        this.enemies = [];
        this.score = 0;
        this.scoreElement = document.getElementById('score'); // Obtiene el elemento del DOM para el marcador
        this.enemyTimer = 0;
        this.enemyFrequency = 2000; // New enemy every 2000ms (2 seconds)
        this.timeSinceStart = 0; // Tiempo total transcurrido desde el inicio del juego
        this.frequencyDecrementInterval = 15000; // Intervalo para decrementar la frecuencia (15 segundos)
        this.minEnemyFrequency = 500; // La frecuencia mínima de aparición de enemigos (500 ms)
        this.lastFrameTime = 0;
        this.KILL_ALIEN_MOUSE_POINTS = 500000;
        this.ENEMY_REQUENCY = 100;
    }

    bindKeyboardEvents() {
        window.addEventListener('keydown', (event) => this.handleKeyUpDown(event, true));
        window.addEventListener('keyup', (event) => this.handleKeyUpDown(event, false));
    }

    handleKeyUpDown(event, active_key) {
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
        this.resetGame();
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
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    gameLoop(timestamp) {
        // Calculate the time elapsed since the last frame
        if (0 === this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        if (!this.running) return;
        this.update(deltaTime);
        this.render();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    update(deltaTime) {
        // Actualiza el tiempo total transcurrido
        this.timeSinceStart += deltaTime;

        // Ajusta la frecuencia de aparición de enemigos en base al tiempo transcurrido
        if (this.timeSinceStart > this.frequencyDecrementInterval && this.enemyFrequency > this.minEnemyFrequency) {
            this.enemyFrequency -= this.ENEMY_REQUENCY; // Decrementa la frecuencia por 100 ms
            this.timeSinceStart -= this.frequencyDecrementInterval; // Restablece el intervalo de tiempo
        }

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

        // Actualizar y dibujar enemigos
        this.enemies.forEach((enemy, index) => {
            if (enemy.isAlive) {
                enemy.update();
            }

            // Comprobar colisión con rayos
            this.rays.forEach((ray, rayIndex) => {
                if (enemy.isAlive && ray.x < enemy.x + enemy.width &&
                    ray.x + ray.width > enemy.x &&
                    ray.y < enemy.y + enemy.height &&
                    ray.y + ray.height > enemy.y) {
                    enemy.hitByRay();
                    this.rays.splice(rayIndex, 1); // Eliminar el rayo
                    enemy.update();
                    this.updateScore(this.KILL_ALIEN_MOUSE_POINTS);
                }
            });

            // Comprobar si el enemy alcanza a Puchi
            if (enemy.isAlive && enemy.x < this.puchi.x + this.puchi.width &&
                enemy.x + enemy.width > this.puchi.x &&
                enemy.y < this.puchi.y + this.puchi.height &&
                enemy.y + enemy.height > this.puchi.y) {
                this.gameOver();
            }

            if (!enemy.isAlive || enemy.offScreen()) {
                // Eliminar enemy si está muerto o fuera de pantalla
                this.enemies.splice(index, 1);
            }
        });

        // Agregar enemigos con cierta lógica, por ejemplo, en intervalos o aleatoriamente
        this.maybeAddEnemy(deltaTime);
    }

    render() {
        // Clear the canvas and render game objects
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.puchi.draw();
        this.rays.forEach(ray => ray.draw());
        this.enemies.forEach(enemy => {
            if (enemy.isAlive) {
                enemy.draw();
            }
        });
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

    gameOver() {
        // Manejar el fin del juego
        this.running = false;
        document.getElementById('startButton').style.display = 'block';
    }

    resetGame() {
        this.score = 0;
        this.updateScore(this.score);
        this.enemyFrequency = 2000; // La frecuencia inicial, ajusta según sea necesario
        this.enemyTimer = 0; // Reinicia el temporizador de aparición de enemigos
        this.enemies = [];
        this.rays = [];
    }

    maybeAddEnemy(deltaTime) {
        // Increment the timer with the elapsed time since the last update
        this.enemyTimer += deltaTime;

        // Check if it's time to add a new enemy
        if (this.enemyTimer > this.enemyFrequency) {
            // Add a new enemy at a random Y position
            const randomY = Math.random() * (this.canvas.height - 50); // 50 is enemy's height
            this.enemies.push(new Enemy(this.ctx, this.canvas.width, randomY, 'images/enemigo-50.png'));
            // Reset the timer
            this.enemyTimer = 0;
        }
    }

    updateScore(points) {
        this.score += points; // Añade puntos a la puntuación actual
        let score_text = this.score.toString();
        if (0 < points) {
            score_text = score_text.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
        this.scoreElement.textContent = score_text;
    }
}

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game('gameCanvas');
    game.resetGame();
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        game.start();
    });
});
