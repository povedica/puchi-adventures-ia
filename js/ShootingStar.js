export default class ShootingStar {
    constructor(galaxy) {
        this.element = document.createElement('div');
        this.element.className = 'shooting-star';
        this.galaxy = galaxy;
        this.start();
    }

    start() {
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        this.element.style.left = `${startX}vw`;
        this.element.style.top = `${startY}vh`;

        this.galaxy.appendChild(this.element);
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
            this.galaxy.removeChild(this.element);
        }, Math.random() * 3000 + 500);
    }
};