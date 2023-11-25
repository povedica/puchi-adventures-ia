import Game from './Game.js';

export default class RankingManager {
    constructor(firebaseManager) {
        this.firebaseManager = firebaseManager;
        this.scores = [];
    }

    async getScoresFromFirebase() {
        this.scores = await this.firebaseManager.getScores();
        this.renderScores();
    }

    addNewScore(initials, score) {
        this.firebaseManager.addScore(initials, score)
            .then(() => this.getScoresFromFirebase())
            .catch(error => console.error("Error adding new score", error));
    }

    renderScores() {
        this.formatRanking();
    }

    async updateRankingUI() {
        await this.getScoresFromFirebase(); // Asume que este método obtiene las puntuaciones de Firebase
        this.formatRanking();
    }

    formatRanking() {
        const rankingList = document.getElementById('scoreList');
        rankingList.innerHTML = ''; // Limpia la lista actual

        this.scores.forEach((score, index) => {
            const listItem = document.createElement('li');
            let points = parseInt(score.score);
            let score_text = score.score.toString();
            if (0 < points) {
                score_text = score_text.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
            listItem.textContent = `${score.initials}: ${score_text}`;
            rankingList.appendChild(listItem);
        });
    }
}


// Asegúrate de que el DOM esté completamente cargado antes de ejecutar tu script
document.addEventListener('DOMContentLoaded', function () {
    // Aquí puedes instanciar y configurar tu juego y rankingManager
    const game = new Game();
    const rankingManager = new RankingManager();
    let isSaveButtonEventAttached = false;
    if (isSaveButtonEventAttached) return;

    // Configurar el manejador del evento click para el botón de guardar
    document.getElementById('saveScoreButton').addEventListener('click', async function () {
        const initials = document.getElementById('playerInitials').value;
        initials.focus();
        const score = game.getCurrentScore(); // Suponiendo que esta función existe en game.js

        if (initials && null !== score) {
            await rankingManager.addNewScore(initials, score);
            await rankingManager.updateScores(); // Esto actualizará y mostrará el ranking
        }
    });
    isSaveButtonEventAttached = true;

    // Aquí puedes incluir cualquier otra configuración inicial
});
