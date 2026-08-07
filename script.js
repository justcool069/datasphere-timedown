// 24 Hours in seconds = 24 * 60 * 60 = 86400 seconds
const TOTAL_SECONDS = 24 * 60 * 60;
let remainingSeconds = TOTAL_SECONDS;
let timerInterval = null;
let isRunning = false;

// DOM Elements
const timerCard = document.getElementById('timer-card');
const headerStatus = document.getElementById('header-status');
const statusText = document.getElementById('status-text');
const hoursBadge = document.getElementById('hours-left-badge');

const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const progressFill = document.getElementById('progress-fill');
const elapsedPercentageEl = document.getElementById('elapsed-percentage');

// Target calculation: Start 07/08/2026 11:00 AM to Next Day 08/08/2026 11:00 AM
function calculateRemainingSeconds() {
    const now = new Date();
    
    // Set target specifically to August 8, 2026 at 11:00:00 AM
    let target = new Date(2026, 7, 8, 11, 0, 0, 0); // Month is 0-indexed, so 7 is August
    
    const diffMs = target - now;
    const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));
    
    return diffSeconds;
}

// Initialize Display
function updateDisplay() {
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    // Pad numbers with leading zero if needed
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');

    // Update Badge text explicitly showing hours left
    if (hours === 1) {
        hoursBadge.textContent = `1 HOUR LEFT`;
    } else if (hours === 0) {
        const minsLeft = Math.ceil(remainingSeconds / 60);
        hoursBadge.textContent = `${minsLeft} MINS LEFT`;
    } else {
        hoursBadge.textContent = `${hours} HOURS LEFT`;
    }

    // Progress percentage relative to 24 hours total limit
    const pct = Math.min(100, Math.max(0, (remainingSeconds / TOTAL_SECONDS) * 100));
    progressFill.style.width = `${pct}%`;
    elapsedPercentageEl.textContent = `${pct.toFixed(1)}% REMAINING`;
}

// Automatically Start Timer
function startTimerAuto() {
    remainingSeconds = calculateRemainingSeconds();
    updateDisplay();

    if (remainingSeconds <= 0) {
        statusText.textContent = 'STATUS: TIME UP!';
        hoursBadge.textContent = '0 HOURS LEFT';
        timerCard.classList.remove('active');
        headerStatus.classList.remove('running');
        return;
    }

    isRunning = true;
    timerCard.classList.add('active');
    headerStatus.classList.add('running');
    statusText.textContent = 'STATUS: HACKATHON LIVE';

    timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            statusText.textContent = 'STATUS: TIME UP!';
            hoursBadge.textContent = '0 HOURS LEFT';
            timerCard.classList.remove('active');
            headerStatus.classList.remove('running');
            alert('🎉 Time is Up! The 24-Hour Datathon has concluded!');
        }
    }, 1000);
}

// Automatically trigger start
startTimerAuto();

/* ===================================================
   BACKGROUND CANVAS PARTICLES & DATASTREAM ANIMATION
   =================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        // Theme colors: Blue & Yellow
        const isYellow = Math.random() > 0.65;
        this.color = isYellow ? 'rgba(250, 204, 21, ' : 'rgba(0, 240, 255, ';
        this.alpha = Math.random() * 0.6 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + '0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Create particles
const particleCount = Math.min(Math.floor(window.innerWidth / 12), 80);
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Animation loop with floating connection lines
function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    // Draw connection lines between close particles
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
                const lineAlpha = (1 - dist / 130) * 0.15;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();
