/**
 * IMRANAI.STORE // INTERACTIVE CONSTELLATION & MOUSE LASER PARTICLE ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let isMouseOver = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseOver = true;
    });

    window.addEventListener('mouseleave', () => {
        isMouseOver = false;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particleCount = Math.min(Math.floor((width * height) / 12000), 85);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2 + 1.2,
            alpha: Math.random() * 0.6 + 0.4
        });
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 243, 255, ${p.alpha})`;
            ctx.fill();

            // Connect particles to mouse cursor within 180px radius
            if (isMouseOver && window.innerWidth > 900) {
                const mouseDist = Math.hypot(p.x - mouseX, p.y - mouseY);
                if (mouseDist < 180) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(0, 243, 255, ${1 - mouseDist / 180})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }

            // Connect to nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 243, 255, ${(1 - dist / 110) * 0.25})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        // Draw cyan outer target ring & center dot at mouse position
        if (isMouseOver && window.innerWidth > 900) {
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 22, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.9)';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#00f3ff';
            ctx.shadowBlur = 18;
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#00f3ff';
            ctx.fill();
        }

        requestAnimationFrame(render);
    }

    render();
});
