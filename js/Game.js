import Galaxy from './Galaxy.js';
import Puchi from './Puchi.js';
import Ray from './Ray.js';
import Enemy from "./Enemy.js";
import Explosion from "./Explosion.js";
import AmmoPowerUp from "./PowerUps/AmmoPowerUp.js";
import {updateRanking} from './Services/Ranking.js';

export default class Game {

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
        this.minEnemyFrequency = 100; // La frecuencia mínima de aparición de enemigos (500 ms)
        this.lastFrameTime = 0;
        this.KILL_ALIEN_MOUSE_POINTS = 500000;
        this.ENEMY_REQUENCY = 100;
        this.explosions = [];
        this.powerUps = []; // Almacenar los power-ups
        this.powerUpTimer = 0;
        this.powerUpFrequency = 10000; // 10 segundos, ajusta según sea necesario
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
            position_y
        );
        this.updateShotsLeftDisplay(); // Actualiza el marcador de disparos
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    gameLoop(timestamp) {
        // Calculate the time elapsed since the last frame
        if (0 === this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = (timestamp - this.lastFrameTime);
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
            this.puchi.update(deltaTime);
        }
        // Actualizar la posición de los rayos
        this.rays = this.rays.filter(ray => {
            ray.update();
            return !ray.offScreen(); // Filtra los rayos que aún están en pantalla
        });

        // Actualizar y dibujar enemigos
        this.enemies.forEach((enemy, enemyIndex) => {
            if (enemy.isAlive) {
                enemy.update();
            }

            // Comprobar colisión con rayos
            this.rays.forEach((ray, rayIndex) => {
                if (this.isColliding(ray, enemy)) {
                    this.handleRayAlienCollision(ray, enemy);
                    enemy.hitByRay();
                    // Elimina el rayo y el enemigo después de la colisión
                    this.rays.splice(rayIndex, 1);
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
                this.enemies.splice(enemyIndex, 1);
            }

        });

        // Agregar enemigos con cierta lógica, por ejemplo, en intervalos o aleatoriamente
        this.maybeAddEnemy(deltaTime);

        // Actualiza las explosiones
        this.explosions = this.explosions.filter(explosion => {
            explosion.update(deltaTime);
            return explosion.isAlive();
        });

        this.powerUps.forEach((powerUp, index) => {
            if (powerUp.collectedBy(this.puchi)) {
                powerUp.handlePowerUp(this.puchi); // Activa el PowerUp
                this.powerUps.splice(index, 1); // Elimina el PowerUp después de ser recogido
                this.updateShotsLeftDisplay(); // Actualiza si es necesario
                powerUp.toBeRemoved = true;
            }

            powerUp.update(deltaTime);
        });

        this.powerUpTimer += deltaTime;
        if (this.powerUpTimer > this.powerUpFrequency) {
            this.addPowerUp();
            this.powerUpTimer = 0; // Resetear el temporizador
        }

        // Filtrar los powerUps para eliminar los que han sido recogidos o deben ser eliminados
        this.powerUps = this.powerUps.filter(powerUp => !powerUp.toBeRemoved);
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

        if (this.explosions.length > 0) {
            this.explosions.forEach(explosion => explosion.draw());
        }

        // Dibuja los power-ups
        this.powerUps.forEach(powerUp => powerUp.draw());
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

    isColliding(ray, enemy) {
        return enemy.isAlive && ray.x < enemy.x + enemy.width &&
            ray.x + ray.width > enemy.x &&
            ray.y < enemy.y + enemy.height &&
            ray.y + ray.height > enemy.y;
    }

    gameOver() {
        // Manejar el fin del juego
        this.running = false;
        this.showGameOver();
        this.showRankingScore();
    }

    resetGame() {
        this.score = 0;
        // Limpiar los power-ups existentes
        this.powerUps = [];
        this.updateScore(this.score);
        document.getElementById('gameOverContainer').style.display = 'none';
        this.enemyFrequency = 2000; // La frecuencia inicial, ajusta según sea necesario
        this.enemyTimer = 0; // Reinicia el temporizador de aparición de enemigos
        this.enemies = [];
        this.rays = [];

        // No olvides reiniciar la cantidad de disparos de Puchi y actualizar la interfaz
        if (this.puchi) {
            this.puchi.shotsLeft = 50; // Reinicia los disparos de Puchi
            this.updateShotsLeftDisplay(); // Actualiza el marcador de disparos
        }
    }

    maybeAddEnemy(deltaTime) {
        // Increment the timer with the elapsed time since the last update
        this.enemyTimer += deltaTime;

        // Check if it's time to add a new enemy
        if (this.enemyTimer > this.enemyFrequency) {
            // Add a new enemy at a random Y position
            const randomY = Math.random() * (this.canvas.height - 50); // 50 is enemy's height
            this.enemies.push(new Enemy(this.ctx, this.canvas.width, randomY));
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

    showGameOver() {
        // Muestra la imagen de Game Over y el botón de reinicio
        document.getElementById('gameOverContainer').style.display = 'block';
        document.getElementById('playerInitials').focus();
        document.getElementById('restartButton').style.display = 'block';
        this.running = false; // Detiene el juego
    }

    resizeCanvas() {
        const canvas = document.getElementById('gameCanvas');
        // Establece el ancho del canvas igual al ancho del viewport
        canvas.width = window.innerWidth;

        // Establece la altura del canvas igual a la altura del viewport
        canvas.height = window.innerHeight;
    }

    // Método para manejar la colisión rayo-alienígena
    handleRayAlienCollision(ray, enemy) {
        this.explosions.push(new Explosion(this.ctx, enemy.x, enemy.y));
    }

    updateShotsLeftDisplay() {
        document.getElementById('shotsLeftCount').textContent = this.puchi.shotsLeft;
    }

    shootRays() {
        if (this.puchi.shoot()) {
            const rayOrigin = this.puchi.getRayOrigin();
            this.rays.push(new Ray(this.ctx, this.puchi.x + (this.puchi.spriteNatural.naturalWidth / 2), this.puchi.y + (this.puchi.spriteNatural.naturalHeight / 2)));
            this.updateShotsLeftDisplay();
        }
    }

    // Método para añadir un power-up al juego
    addPowerUp() {
        const x = Math.random() * (this.canvas.width - 30);
        const y = Math.random() * (this.canvas.height - 30);
        this.powerUps.push(new AmmoPowerUp(this.ctx, x, y));
    }

    // ...
    showRankingScore() {
        let game = this;
        updateRanking(game);
    }

    getCurrentScore() {
        return this.score;
    }
}

// Inicializar el juego
const game = new Game('gameCanvas');
document.addEventListener('DOMContentLoaded', () => {
    new Galaxy('galaxy');
    game.resetGame();
    game.resizeCanvas();
    const start_buttons = document.getElementsByClassName('game-button');
    // Ajusta el tamaño del canvas cuando el usuario cambia el tamaño de la ventana
    window.addEventListener('resize', game.resizeCanvas);
    Array.from(start_buttons).forEach((button) => {
        button.addEventListener('click', () => {
            button.style.display = 'none';
            game.start();
        });
    });
});
