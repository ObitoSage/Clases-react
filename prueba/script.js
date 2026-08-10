// =========================================
//   SOLAR SYSTEM EXPLORER — SCRIPT
// =========================================

// --- Starfield Canvas ---
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const stars = Array.from({ length: 300 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.2,
    alpha: Math.random(),
    speed: Math.random() * 0.004 + 0.001,
    twinkleDir: Math.random() > 0.5 ? 1 : -1,
}));

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Nebula-like gradient background
    const nebula1 = ctx.createRadialGradient(
        canvas.width * 0.15, canvas.height * 0.2, 0,
        canvas.width * 0.15, canvas.height * 0.2, canvas.width * 0.35
    );
    nebula1.addColorStop(0, 'rgba(30, 10, 60, 0.5)');
    nebula1.addColorStop(1, 'transparent');
    ctx.fillStyle = nebula1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const nebula2 = ctx.createRadialGradient(
        canvas.width * 0.85, canvas.height * 0.7, 0,
        canvas.width * 0.85, canvas.height * 0.7, canvas.width * 0.4
    );
    nebula2.addColorStop(0, 'rgba(5, 25, 60, 0.45)');
    nebula2.addColorStop(1, 'transparent');
    ctx.fillStyle = nebula2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars with twinkling
    stars.forEach(star => {
        star.alpha += star.speed * star.twinkleDir;
        if (star.alpha >= 1) star.twinkleDir = -1;
        if (star.alpha <= 0.1) star.twinkleDir = 1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 235, 255, ${star.alpha})`;
        ctx.fill();
    });

    requestAnimationFrame(drawStars);
}
drawStars();

// --- Speed Control ---
const speedSlider = document.getElementById('speedSlider');
const solarSystem = document.getElementById('solarSystem');
const allPlanetWrappers = document.querySelectorAll('.planet-wrapper, .moon-orbit');

speedSlider.addEventListener('input', () => {
    const speed = parseFloat(speedSlider.value);
    allPlanetWrappers.forEach(el => {
        const baseDuration = el.dataset.baseDuration;
        if (!baseDuration) return;
        if (speed === 0) {
            el.style.animationPlayState = 'paused';
        } else {
            el.style.animationPlayState = 'running';
            el.style.animationDuration = (parseFloat(baseDuration) / speed) + 's';
        }
    });
});

// Store base durations for each orbit
allPlanetWrappers.forEach(el => {
    const computed = getComputedStyle(el).animationDuration;
    el.dataset.baseDuration = parseFloat(computed);
});

// --- Pause Button ---
const pauseBtn = document.getElementById('togglePause');
let paused = false;

pauseBtn.addEventListener('click', () => {
    paused = !paused;
    const body = document.body;
    if (paused) {
        allPlanetWrappers.forEach(el => el.style.animationPlayState = 'paused');
        pauseBtn.textContent = '▶ Resume';
        pauseBtn.style.color = '#ffb347';
        pauseBtn.style.borderColor = '#ffb347';
    } else {
        allPlanetWrappers.forEach(el => el.style.animationPlayState = 'running');
        pauseBtn.textContent = '⏸ Pause';
        pauseBtn.style.color = '';
        pauseBtn.style.borderColor = '';
        // Reapply current speed
        speedSlider.dispatchEvent(new Event('input'));
    }
});

// --- Toggle Orbits ---
const orbitsBtn = document.getElementById('toggleOrbits');
let orbitsVisible = true;

orbitsBtn.addEventListener('click', () => {
    orbitsVisible = !orbitsVisible;
    solarSystem.classList.toggle('orbits-hidden', !orbitsVisible);
    orbitsBtn.textContent = orbitsVisible ? 'Orbits ON' : 'Orbits OFF';
    orbitsBtn.style.color = orbitsVisible ? '' : 'var(--text-secondary)';
});

// --- Planet Tooltip ---
const tooltip = document.getElementById('planetTooltip');
const tooltipName = document.getElementById('tooltipName');
const tooltipDesc = document.getElementById('tooltipDesc');
const tooltipDist = document.getElementById('tooltipDist');
const tooltipMoons = document.getElementById('tooltipMoons');
const tooltipYear = document.getElementById('tooltipYear');
const tooltipIcon = document.getElementById('tooltipIcon');

// Planet gradient map for the tooltip icon
const planetGradients = {
    Mercury: 'radial-gradient(circle at 35% 35%, #c8bdb5, #8a7a72 60%, #5a4e49)',
    Venus:   'radial-gradient(circle at 35% 35%, #ffe0a0, #e8b560 50%, #c8853a)',
    Earth:   'radial-gradient(circle at 30% 30%, #aee8ff, #2980b9 40%, #27ae60)',
    Mars:    'radial-gradient(circle at 35% 35%, #f4a582, #c0392b 50%, #8B2500)',
    Jupiter: 'repeating-linear-gradient(180deg, #c8a870, #d4b080 4px, #a87840 8px, #c8a870 12px)',
    Saturn:  'radial-gradient(circle at 35% 35%, #f0dca0, #d4b870 50%, #b09040)',
    Uranus:  'radial-gradient(circle at 35% 35%, #c8f0f0, #72c8c8 50%, #3a9090)',
    Neptune: 'radial-gradient(circle at 35% 35%, #a0c0ff, #3060d0 50%, #1a3080)',
};

const planets = document.querySelectorAll('.planet');

planets.forEach(planet => {
    planet.addEventListener('mouseenter', () => {
        const name = planet.dataset.name;
        tooltipName.textContent = name;
        tooltipDesc.textContent = planet.dataset.desc;
        tooltipDist.textContent = planet.dataset.dist;
        tooltipMoons.textContent = planet.dataset.moons;
        tooltipYear.textContent = planet.dataset.year;
        tooltipIcon.style.background = planetGradients[name] || '#888';
        tooltip.classList.add('visible');
    });

    planet.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
    });
});

// --- Drag to Pan Scene ---
const scene = document.getElementById('solarScene');
let isDragging = false;
let startX, startY, rotX = 65, rotY = 0;

scene.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
});

window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = (e.clientX - startX) * 0.3;
    const dy = (e.clientY - startY) * 0.3;
    startX = e.clientX;
    startY = e.clientY;
    rotX = Math.max(20, Math.min(85, rotX + dy));
    rotY += dx;
    solarSystem.style.transform = `rotateX(${rotX}deg) rotateZ(${rotY}deg)`;
});

window.addEventListener('mouseup', () => isDragging = false);

// --- Scroll to Zoom ---
let scale = 0.6;

scene.addEventListener('wheel', e => {
    e.preventDefault();
    scale -= e.deltaY * 0.0005;
    scale = Math.max(0.3, Math.min(1.2, scale));
    solarSystem.style.transform = `rotateX(${rotX}deg) rotateZ(${rotY}deg) scale(${scale})`;
}, { passive: false });

// Initial scale
solarSystem.style.transform = `rotateX(${rotX}deg) rotateZ(${rotY}deg) scale(${scale})`;
