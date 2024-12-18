// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ensure the canvas fills the entire viewport
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Adjust canvas size on load and resize events
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game objects
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 30,
    color: 'cyan',
    speed: 5,
    angle: 0, // Richting van het kanon
};

const bullets = [];

// Controls
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
};

window.addEventListener('keydown', (e) => {
    if (keys[e.key] !== undefined) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (keys[e.key] !== undefined) keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    // Update de richting van het kanon gebaseerd op de muispositie
    player.angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
});

canvas.addEventListener('click', (e) => {
    const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
    bullets.push({
        x: player.x + Math.cos(angle) * player.size, // Startpunt buiten de speler
        y: player.y + Math.sin(angle) * player.size, // Startpunt buiten de speler
        angle: angle,
        speed: 10,
        size: 5,
        color: 'cyan',
    });
});

function updatePlayer() {
    if (keys.w) player.y -= player.speed;
    if (keys.s) player.y += player.speed;
    if (keys.a) player.x -= player.speed;
    if (keys.d) player.x += player.speed;

    // Keep player within bounds
    player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;

        // Remove bullets outside of canvas
        if (
            b.x < 0 ||
            b.x > canvas.width ||
            b.y < 0 ||
            b.y > canvas.height
        ) {
            bullets.splice(i, 1);
        }
    }
}

function drawPlayer() {
    // Teken de tank zelf
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();

    // Teken het kanon
    const barrelLength = player.size * 1.5; // Lengte van het kanon
    const barrelWidth = player.size * 0.4; // Breedte van het kanon

    ctx.save(); // Sla de huidige context op
    ctx.translate(player.x, player.y); // Verplaats het canvas naar de speler
    ctx.rotate(player.angle); // Draai naar de richting van het kanon
    ctx.fillStyle = 'gray'; // Kleur van het kanon
    ctx.fillRect(player.size * 0.8, -barrelWidth / 2, barrelLength, barrelWidth); // Start het kanon buiten de cirkel
    ctx.restore(); // Herstel de context
}

function drawBullets() {
    for (const b of bullets) {
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    updateBullets();

    drawPlayer();
    drawBullets();

    requestAnimationFrame(gameLoop);
}

gameLoop();
