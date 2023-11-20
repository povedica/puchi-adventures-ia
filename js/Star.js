export default class Star {
    constructor(galaxy) {
        this.element = document.createElement('div');
        this.element.className = 'star';
        this.size = Math.random() * 3 + 1; // 1px to 4px
        this.position(galaxy);
    }

    position(galaxy) {
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.top = `${Math.random() * 100}%`;
        this.element.style.left = `${Math.random() * 100}%`;
        galaxy.appendChild(this.element);
    }
};