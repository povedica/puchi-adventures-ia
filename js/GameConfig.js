window.gameConfig = {
    debugMode: false
};


let debugKeyPressTimer;
let keyPressDuration = 3000; // 3 segundos

window.addEventListener('keydown', (event) => {
    if (event.key === 'b' || event.key === 'B') {
        if (!debugKeyPressTimer) { // Solo si el temporizador no está ya corriendo
            debugKeyPressTimer = setTimeout(() => {
                // Activar o desactivar el modo debug
                window.gameConfig.debugMode = !window.gameConfig.debugMode;
                console.log('Modo debug ' + (window.gameConfig.debugMode ? 'activado' : 'desactivado'));
            }, keyPressDuration);
        }
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'b' || event.key === 'B') {
        clearTimeout(debugKeyPressTimer); // Cancelar el temporizador si la tecla se suelta
        debugKeyPressTimer = null;
    }
});
