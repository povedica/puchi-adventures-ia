// RankingIntegration.js
import FirebaseManager from '../FirebaseManager.js';
import RankingManager from '../RankingManager.js';

const firebaseManager = new FirebaseManager();
const rankingManager = new RankingManager(firebaseManager);

export async function updateRanking(game) {
    document.getElementById('saveScoreButton').addEventListener('click', function () {
        const initials = document.getElementById('playerInitials').value;
        const score = game.getCurrentScore();

        // Guardar la puntuación en Firebase y actualizar el ranking
        rankingManager.addNewScore(initials, score);
    });
    rankingManager.getScoresFromFirebase();
    await rankingManager.updateRankingUI(); // Actualiza y muestra el ranking
}

export function submitScore(initials, score) {
    rankingManager.addNewScore(initials, score);
}
