const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.className = "space-canvas";
document.body.prepend(canvas);

let width;
let height;
let stars = [];
let packets = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createStars() {
    stars = [];

    const count = Math.floor((width * height) / 9000);

    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: random(0.3, 1.6),
            speed: random(0.05, 0.25),
            alpha: random(0.2, 0.8)
        });
    }
}

function createPacket() {
    const nodes = [
        { x: width * 0.12, y: height * 0.28 },
        { x: width * 0.32, y: height * 0.18 },
        { x: width * 0.56, y: height * 0.32 },
        { x: width * 0.78, y: height * 0.22 },
        { x: width * 0.88, y: height * 0.52 },
        { x: width * 0.65, y: height * 0.72 },
        { x: width * 0.35, y: height * 0.68 },
        { x: width * 0.16, y: height * 0.55 }
    ];

    const from = nodes[Math.floor(Math.random() * nodes.length)];
    const to = nodes[Math.floor(Math.random() * nodes.length)];

    if (from === to) return;

    packets.push({
        from,
        to,
        progress: 0,
        speed: random(0.002, 0.006),
        label: Math.random() > 0.5 ? "GET /" : "200 OK"
    });
}

function drawStars() {
    for (const star of stars) {
        star.y += star.speed;

        if (star.y > height) {
            star.y = 0;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(180, 210, 255, ${star.alpha})`;
        ctx.fill();
    }
}

function drawPacket(packet) {
    const x =
        packet.from.x +
        (packet.to.x - packet.from.x) * packet.progress;

    const y =
        packet.from.y +
        (packet.to.y - packet.from.y) * packet.progress;

    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(120, 190, 255, 0.95)";
    ctx.fill();

    ctx.font = "10px monospace";
    ctx.fillStyle = "rgba(140, 190, 240, 0.35)";
    ctx.fillText(packet.label, x + 7, y - 7);
}

function drawConnections() {
    const nodes = [
        [0.12, 0.28],
        [0.32, 0.18],
        [0.56, 0.32],
        [0.78, 0.22],
        [0.88, 0.52],
        [0.65, 0.72],
        [0.35, 0.68],
        [0.16, 0.55]
    ];

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "rgba(100, 150, 220, 0.10)";

    for (let i = 0; i < nodes.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(
            nodes[i][0] * width,
            nodes[i][1] * height
        );

        ctx.lineTo(
            nodes[i + 1][0] * width,
            nodes[i + 1][1] * height
        );

        ctx.stroke();
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    drawStars();
    drawConnections();

    for (const packet of packets) {
        packet.progress += packet.speed;

        drawPacket(packet);
    }

    packets = packets.filter(packet => packet.progress < 1);

    if (Math.random() < 0.025) {
        createPacket();
    }

    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    resize();
    createStars();
});

resize();
createStars();

for (let i = 0; i < 8; i++) {
    createPacket();
}

animate();
