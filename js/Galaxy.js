function startGalaxy() {

    const galaxy = document.getElementById('galaxy');

    class Star {
        constructor() {
            this.element = document.createElement('div');
            this.element.className = 'star';
            this.size = Math.random() * 3 + 1; // 1px to 4px
            this.position();
        }

        position() {
            this.element.style.width = `${this.size}px`;
            this.element.style.height = `${this.size}px`;
            this.element.style.top = `${Math.random() * 100}%`;
            this.element.style.left = `${Math.random() * 100}%`;
            galaxy.appendChild(this.element);
        }
    }

    class ShootingStar {
        constructor() {
            this.element = document.createElement('div');
            this.element.className = 'shooting-star';
            this.start();
        }

        start() {
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            this.element.style.left = `${startX}vw`;
            this.element.style.top = `${startY}vh`;

            galaxy.appendChild(this.element);
            this.shoot();
        }

        shoot() {
            this.element.animate([
                {transform: 'translate(0, 0)', opacity: 1},
                {transform: `translate(${100 + Math.random() * 300}px, ${100 + Math.random() * 300}px)`, opacity: 0}
            ], {
                duration: Math.random() * 3000 + 500, // between 0.5 and 3.5 seconds
                easing: 'linear',
                iterations: 1,
            });

            setTimeout(() => {
                galaxy.removeChild(this.element);
            }, Math.random() * 3000 + 500);
        }
    }

// Create multiple static stars
    for (let i = 0; i < 200; i++) {
        new Star();
    }

// Create shooting stars at intervals
    setInterval(() => new ShootingStar(), 2000);

}

document.addEventListener('DOMContentLoaded', startGalaxy);