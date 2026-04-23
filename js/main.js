/* ══════════════════════════════════════════
   ThePelumiOnafuye Portfolio — Main Script
   ══════════════════════════════════════════ */

/* ── PARTICLE CANVAS ── */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() { this.reset(true); }
    reset(init) {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height : (Math.random() > 0.5 ? -5 : canvas.height + 5);
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.r = Math.random() * 1.8 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -5 || this.x > canvas.width + 5 || this.y < -5 || this.y > canvas.height + 5) {
            this.reset(false);
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${this.alpha})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const n = Math.min(90, Math.floor((canvas.width * canvas.height) / 13000));
    for (let i = 0; i < n; i++) particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 115) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0,229,255,${0.12 * (1 - d / 115)})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
        particles[i].update();
        particles[i].draw();
    }
    requestAnimationFrame(animate);
}

resizeCanvas();
initParticles();
animate();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

/* ── TYPEWRITER ── */
const roles = [
    'AI/ML Engineer',
    'Agentic AI Builder',
    'Generative AI Researcher',
    'MLOps Practitioner',
    'Neural Network Architect',
    'LLM Systems Engineer',
];
let ri = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter-text');

function typeWriter() {
    const cur = roles[ri];
    tw.textContent = deleting ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
    deleting ? ci-- : ci++;
    if (!deleting && ci === cur.length) {
        setTimeout(() => { deleting = true; }, 2200);
    } else if (deleting && ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
    }
    setTimeout(typeWriter, deleting ? 55 : 95);
}
setTimeout(typeWriter, 1200);

/* ── COUNTER ── */
function animateCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = 'true';
    const target = parseInt(el.dataset.count);
    const dur = 1800;
    const start = Date.now();
    function tick() {
        const p = Math.min((Date.now() - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target) + '+';
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + '+';
    }
    tick();
}

/* ── SCROLL ANIMATIONS ── */
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            e.target.querySelectorAll('[data-count]').forEach(animateCounter);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        document.querySelectorAll('[data-count]').forEach(animateCounter);
    }
}, { threshold: 0.6 }).observe(document.getElementById('hero'));

/* ── NAV SCROLL ── */
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
    const cur = [...document.querySelectorAll('section[id]')]
        .find(s => window.scrollY >= s.offsetTop - 120)?.getAttribute('id') || '';
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
        a.style.color = a.getAttribute('href') === `#${cur}` ? 'var(--accent-cyan)' : '';
    });
});

/* ── MOBILE MENU ── */
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'))
);

/* ── CONTACT FORM (Formspree) ── */
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = document.getElementById('submitBtn');

    /* If Formspree ID is not yet set, fall back to mailto */
    if (form.action.includes('YOUR_FORM_ID')) {
        const name    = form.querySelector('[name="name"]').value;
        const email   = form.querySelector('[name="email"]').value;
        const subject = form.querySelector('[name="subject"]').value || 'Portfolio contact';
        const message = form.querySelector('[name="message"]').value;
        const body    = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
        window.location.href = `mailto:onafuyepelumi@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
        return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    try {
        const res = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
        });
        if (res.ok) {
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = 'linear-gradient(135deg,#00ff88,#00b361)';
            form.reset();
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                btn.style.background = '';
                btn.disabled = false;
            }, 4000);
        } else {
            throw new Error('Network error');
        }
    } catch {
        btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed — try WhatsApp';
        btn.style.background = 'linear-gradient(135deg,#ef4444,#b91c1c)';
        btn.disabled = false;
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            btn.style.background = '';
        }, 4000);
    }
}
