/**
 * IMRANAI.STORE // ROCK SOLID RESPONSIVE & DYNAMIC SCROLL ANIMATION ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
    try { initCursor(); } catch (e) { console.warn("Cursor init:", e); }
    try { initMobileMenu(); } catch (e) { console.warn("Mobile menu init:", e); }
    try { initTypingEffect(); } catch (e) { console.warn("Typing effect init:", e); }
    try { init3DTilt(); } catch (e) { console.warn("3D tilt init:", e); }
    try { initCharts(); } catch (e) { console.warn("Chart init:", e); }
    try { initTerminal(); } catch (e) { console.warn("Terminal init:", e); }
    try { initContactForm(); } catch (e) { console.warn("Contact form init:", e); }
    try { initToolsCatalog(); } catch (e) { console.warn("Tools catalog init:", e); }
    try { initScrollReveal(); } catch (e) { console.warn("Scroll reveal init:", e); }
});

let globalScrollObserver = null;

/* --- CONTINUOUS ULTRA-SLOW SCROLL UP & DOWN REVEAL OBSERVER --- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.cyber-pop, .scroll-reveal, .anim-slide-left, .anim-slide-right, .anim-flip-3d, .anim-scale-up, .anim-rotate-in, .anim-bounce-up, .tool-card, .tilt-card, .project-card, .stat-box, .stat-hud-box, .hud-card, .step-card, .testimonial-card, .feature-card, .section-title, .playground-card, .faq-item');
    
    if (!revealElements.length) return;

    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
    };

    globalScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active', 'is-visible');
                
                // Animate progress bars from 0 to target width
                const fills = entry.target.querySelectorAll('.progress-bar-fill');
                fills.forEach(f => {
                    const w = f.getAttribute('data-width');
                    if (w) {
                        f.style.width = '0%';
                        setTimeout(() => { f.style.width = w; }, 120);
                    }
                });

                // Animate stat counters up slowly
                const counters = entry.target.querySelectorAll('.stat-counter-val, .stat-number, .skill-pct-counter');
                counters.forEach(c => {
                    const target = parseInt(c.getAttribute('data-target') || c.getAttribute('data-val') || '0', 10);
                    const suffix = c.getAttribute('data-suffix') || (c.classList.contains('skill-pct-counter') ? '%' : '');
                    if (target > 0 && !c.classList.contains('counting-now')) {
                        c.classList.add('counting-now');
                        animateCounter(c, target, suffix);
                    }
                });

                // Re-trigger Chart.js instances if inside
                const canvases = entry.target.querySelectorAll('canvas');
                canvases.forEach(canvas => {
                    if (canvas.chartInstance) {
                        canvas.chartInstance.reset();
                        canvas.chartInstance.update();
                    }
                });
            } else {
                // Reset when out of view so scrolling back up/down re-animates seamlessly!
                const rect = entry.target.getBoundingClientRect();
                if (rect.top > window.innerHeight || rect.bottom < 0) {
                    entry.target.classList.remove('active', 'is-visible');
                    const fills = entry.target.querySelectorAll('.progress-bar-fill');
                    fills.forEach(f => { f.style.width = '0%'; });
                    const counters = entry.target.querySelectorAll('.stat-counter-val, .stat-number, .skill-pct-counter');
                    counters.forEach(c => { c.classList.remove('counting-now'); });
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => globalScrollObserver.observe(el));
}

function animateCounter(el, target, suffix) {
    let current = 0;
    const duration = 3200; // Ultra-slow 3.2 seconds count-up
    const steps = 60;
    const increment = Math.ceil(target / steps);
    const stepTime = duration / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.innerText = `${current}${suffix}`;
    }, stepTime);
}

/* --- CYBER CURSOR ENGINE --- */
function initCursor() {
    const cursorDot = document.getElementById('cyber-cursor');
    const cursorRing = document.getElementById('cyber-cursor-ring');

    if (!cursorDot || !cursorRing) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    document.body.classList.add('has-custom-cursor');

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    function renderRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .tilt-card, .tool-card, .project-card, .stat-box, .hud-card, .chip-btn, .contact-item, input, select, textarea, .feature-card, .step-card, .playground-card')) {
            document.body.classList.add('cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .tilt-card, .tool-card, .project-card, .stat-box, .hud-card, .chip-btn, .contact-item, input, select, textarea, .feature-card, .step-card, .playground-card')) {
            document.body.classList.remove('cursor-hover');
        }
    });
}

/* --- UNIVERSAL MOBILE MENU TOGGLE & DRAWER --- */
function initMobileMenu() {
    const menuBtns = document.querySelectorAll('#mobileMenuBtn, .mobile-toggle, .mobile-menu-btn');
    const drawers = document.querySelectorAll('#mobileNavDrawer, #mobileDrawer, .mobile-menu-drawer, .mobile-nav-drawer');

    if (!menuBtns.length || !drawers.length) return;

    menuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            let anyActive = false;
            drawers.forEach(drawer => {
                drawer.classList.toggle('active');
                if (drawer.classList.contains('active')) {
                    anyActive = true;
                    drawer.style.opacity = '1';
                    drawer.style.pointerEvents = 'auto';
                    drawer.style.transform = 'translateY(0)';
                } else {
                    drawer.style.opacity = '0';
                    drawer.style.pointerEvents = 'none';
                    drawer.style.transform = 'translateY(-100%)';
                }
            });

            const icons = document.querySelectorAll('#menuBtnIcon, #menuIcon, .mobile-toggle i, .mobile-menu-btn i');
            icons.forEach(icon => {
                icon.className = anyActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            });
        });
    });

    drawers.forEach(drawer => {
        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                drawers.forEach(d => {
                    d.classList.remove('active');
                    d.style.opacity = '0';
                    d.style.pointerEvents = 'none';
                    d.style.transform = 'translateY(-100%)';
                });
                const icons = document.querySelectorAll('#menuBtnIcon, #menuIcon, .mobile-toggle i, .mobile-menu-btn i');
                icons.forEach(icon => { icon.className = 'fa-solid fa-bars'; });
            });
        });
    });
}

/* --- TYPING ROLE ANIMATION --- */
function initTypingEffect() {
    const typingElem = document.getElementById('typingRoleText');
    if (!typingElem) return;

    const roles = [
        "SEO Strategist",
        "AI Automation Lead",
        "WordPress Engineer",
        "Digital Marketing Specialist"
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIdx];
        if (isDeleting) {
            typingElem.innerText = currentRole.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typingElem.innerText = currentRole.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentRole.length) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    type();
}

/* --- 3D TILT EFFECT --- */
function init3DTilt() {
    if (window.innerWidth < 900) return;

    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.tilt-card, .tool-card, .feature-card, .hud-card, .project-card, .playground-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            } else {
                card.style.transform = 'none';
            }
        });
    });
}

/* --- CHART.JS INITIALIZER --- */
function initCharts() {
    if (typeof Chart === 'undefined') return;

    const radarCanvas = document.getElementById('radarChart');
    if (radarCanvas) {
        const chart = new Chart(radarCanvas.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['SEO Strategy', 'AI Video Automation', 'Reverse Prompting', 'FastAPI Backend', 'Playwright Bot', 'FFmpeg Pipeline', 'WordPress Tech'],
                datasets: [{
                    label: 'Mastery & Performance',
                    data: [99, 98, 99, 98, 97, 98, 99],
                    backgroundColor: 'rgba(0, 243, 255, 0.25)',
                    borderColor: '#00f3ff',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#ff0055',
                    pointBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0, max: 100,
                        angleLines: { color: 'rgba(0, 243, 255, 0.2)' },
                        grid: { color: 'rgba(0, 243, 255, 0.15)' },
                        pointLabels: { color: '#00f3ff', font: { family: 'Orbitron', size: 9 } },
                        ticks: { display: false }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
        radarCanvas.chartInstance = chart;
    }

    const lineCanvas = document.getElementById('lineChart');
    if (lineCanvas) {
        const chart = new Chart(lineCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Monthly Telemetry',
                    data: [1400, 2900, 5800, 10200, 16500, 24100, 33500, 44000, 56000, 71000, 88000, 100000],
                    borderColor: '#00f3ff',
                    backgroundColor: 'rgba(0, 243, 255, 0.15)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#ff0055'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { family: 'Share Tech Mono' } } },
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { family: 'Share Tech Mono' } } }
                },
                plugins: { legend: { display: false } }
            }
        });
        lineCanvas.chartInstance = chart;
    }
}

/* --- CYBER TERMINAL --- */
function initTerminal() {
    const termInput = document.getElementById('term-input');
    const termBody = document.getElementById('term-body');

    if (!termInput || !termBody) return;

    const commands = {
        help: "Available commands:\n  help        - List all commands\n  tools       - List registered AI applications\n  status      - Display system diagnostics\n  whoami      - Display developer info\n  clear       - Clear terminal output\n  launch <id> - Launch specific tool app",
        tools: "Registered AI Tools:\n  1. imranai-video-studio       - Inverse Video Reverse Prompt Studio\n  2. dola-auto-video-generator  - Automated Script-to-Video Engine\n  3. imranai-prompt-generator    - Master Prompt & Keyword Extractor\n  4. youtube-seo-metadata       - Video SEO Title & Tag Generator\n  5. imranai-content-cloner     - Multi-Platform Video Re-uploader",
        status: "IMRAN AI OS System Diagnostics:\n  [+] Core Engine: ONLINE\n  [+] API Gateway: 99.9% Uptime\n  [+] Cloud GPU Cluster: ACTIVE\n  [+] Active Microservices: 10/10 Live",
        whoami: "Developer Profile:\n  Name: Imran Nazir\n  Role: SEO Strategist & AI Automation Lead\n  Domain: imranai.store\n  Contact: imran.avrodigital.co@gmail.com",
        clear: "CLEAR"
    };

    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const inputVal = termInput.value.trim();
            if (!inputVal) return;

            const promptLine = document.createElement('div');
            promptLine.className = 'term-line';
            promptLine.innerHTML = `<span class="term-prompt">imranai@store:~$</span> ${escapeHTML(inputVal)}`;
            termBody.appendChild(promptLine);

            const parts = inputVal.split(' ');
            const cmd = parts[0].toLowerCase();
            const arg = parts[1] ? parts[1].toLowerCase() : '';

            if (cmd === 'clear') {
                termBody.innerHTML = '';
            } else if (cmd === 'launch' && arg) {
                const outLine = document.createElement('div');
                outLine.className = 'term-line';
                outLine.style.color = '#00ff66';
                outLine.innerText = `[+] Redirecting to tool launcher: ./tools/${arg}.html ...`;
                termBody.appendChild(outLine);
                setTimeout(() => { window.location.href = `./tools/${arg}.html`; }, 1200);
            } else if (commands[cmd]) {
                const outLine = document.createElement('div');
                outLine.className = 'term-line';
                outLine.style.color = '#e2e8f0';
                outLine.innerText = commands[cmd];
                termBody.appendChild(outLine);
            } else {
                const errLine = document.createElement('div');
                errLine.className = 'term-line';
                errLine.style.color = '#ff0055';
                errLine.innerText = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
                termBody.appendChild(errLine);
            }

            termInput.value = '';
            termBody.scrollTop = termBody.scrollHeight;
        }
    });
}

function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* --- CONTACT FORM AJAX SUBMISSION --- */
function initContactForm() {
    const form = document.getElementById('portfolioContactForm');
    const submitBtn = document.getElementById('submitBtn');
    const msgBox = document.getElementById('formStatusMsg');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SENDING MESSAGE...';
        }

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                if (msgBox) {
                    msgBox.style.display = 'block';
                    msgBox.style.color = 'var(--neon-green)';
                    msgBox.innerText = '✓ THANK YOU! YOUR MESSAGE HAS BEEN SENT DIRECTLY TO IMRAN NAZIR.';
                }
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (err) {
            if (msgBox) {
                msgBox.style.display = 'block';
                msgBox.style.color = 'var(--neon-magenta)';
                msgBox.innerText = '✕ ERROR SENDING MESSAGE. PLEASE EMAIL DIRECTLY: imran.avrodigital.co@gmail.com';
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> SEND MESSAGE TO IMRAN NAZIR';
            }
        }
    });
}

/* --- AI TOOLS STORE CATALOG --- */
let allToolsData = [];

async function initToolsCatalog() {
    const catalogGrid = document.getElementById('catalogToolsGrid');
    const featuredGrid = document.getElementById('featuredToolsGrid');

    if (!catalogGrid && !featuredGrid) return;

    try {
        const response = await fetch('./data/tools.json');
        if (!response.ok) throw new Error("Failed to load tools data");
        allToolsData = await response.json();
    } catch (err) {
        console.warn("Using fallback tools data:", err);
        allToolsData = getFallbackToolsData();
    }

    if (!allToolsData || !allToolsData.length) {
        allToolsData = getFallbackToolsData();
    }

    if (featuredGrid) {
        renderFeaturedGrid(featuredGrid, allToolsData.slice(0, 6));
    }

    if (catalogGrid) {
        renderCatalogGrid(catalogGrid, allToolsData);
        setupFilterListeners(catalogGrid);
    }
}

function renderFeaturedGrid(container, tools) {
    container.innerHTML = tools.map((tool, idx) => createToolCardHTML(tool, idx)).join('');
    observeDynamicCards(container);
}

function renderCatalogGrid(container, tools) {
    container.innerHTML = tools.map((tool, idx) => createToolCardHTML(tool, idx)).join('');
    observeDynamicCards(container);
}

function observeDynamicCards(container) {
    const cards = container.querySelectorAll('.tool-card');
    cards.forEach(card => {
        if (globalScrollObserver) {
            globalScrollObserver.observe(card);
        }
    });
}

function createToolCardHTML(tool, index = 0) {
    const detailUrl = tool.links && tool.links.detail ? tool.links.detail : `./tools/${tool.id}.html`;
    const launchUrl = tool.links && tool.links.launch ? tool.links.launch : '#';
    const statusClass = tool.statusClass || 'status-live';
    const icon = tool.icon || 'fa-solid fa-cube';
    const tags = tool.tags || [];

    const animClasses = [
        'anim-slide-left',
        'anim-flip-3d',
        'anim-slide-right',
        'anim-scale-up',
        'anim-rotate-in',
        'anim-bounce-up'
    ];
    const animClass = animClasses[index % animClasses.length];

    const modalTriggerHTML = (launchUrl && launchUrl.startsWith('#modal'))
        ? `onclick="event.stopPropagation(); document.querySelector('${launchUrl}').classList.add('active');"`
        : `onclick="event.stopPropagation(); window.location.href='${launchUrl}#live-app-section';"`;

    const launchBtnHTML = (launchUrl && launchUrl !== '#') 
        ? `<a href="${launchUrl}#live-app-section" class="cyber-btn cyber-btn-sm" ${modalTriggerHTML}><i class="fa-solid fa-rocket"></i> LAUNCH WEB APP</a>`
        : '';

    return `
        <div class="tool-card tilt-card ${animClass}" onclick="window.location.href='${detailUrl}';">
            <div class="tool-card-header">
                <div class="tool-icon-box"><i class="${icon}"></i></div>
                <div class="tool-badges">
                    <span class="status-badge ${statusClass}">${tool.status}</span>
                </div>
            </div>
            <h3 class="tool-card-title">${tool.name}</h3>
            <p class="tool-card-desc">${tool.description}</p>
            <div class="tag-pills">
                ${tags.slice(0, 4).map(t => `<span class="tag-pill">${t}</span>`).join('')}
            </div>
            <div class="tool-card-footer">
                <a href="${detailUrl}" class="cyber-btn cyber-btn-outline cyber-btn-sm" onclick="event.stopPropagation();">
                    <i class="fa-solid fa-circle-info"></i> DETAILS & WORKFLOW
                </a>
                ${launchBtnHTML}
            </div>
        </div>
    `;
}

function setupFilterListeners(container) {
    const searchInput = document.getElementById('toolSearchInput');
    const chipBtns = document.querySelectorAll('.chip-btn');

    let currentFilter = 'all';
    let currentSearch = '';

    function filterTools() {
        let filtered = allToolsData;
        if (currentFilter !== 'all') {
            filtered = filtered.filter(t => t.category === currentFilter);
        }
        if (currentSearch) {
            filtered = filtered.filter(t => 
                t.name.toLowerCase().includes(currentSearch) || 
                t.description.toLowerCase().includes(currentSearch) ||
                (t.tags && t.tags.some(tag => tag.toLowerCase().includes(currentSearch)))
            );
        }
        renderCatalogGrid(container, filtered);
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            filterTools();
        });
    }

    chipBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            chipBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            filterTools();
        });
    });
}

function getFallbackToolsData() {
    return [
        {
            "id": "imranai-social-video-downloader",
            "name": "ImranAI 4K Social Media Video Downloader",
            "description": "Multi-platform 4K video & audio downloader engine supporting YouTube, TikTok, Instagram Reels, Facebook, Twitter/X, Pinterest, Reddit, Threads, and 17+ platforms.",
            "category": "utilities",
            "status": "LIVE APP",
            "statusClass": "status-live",
            "icon": "fa-solid fa-download",
            "tags": ["yt-dlp", "Python", "4K Downloader", "MP3 Extractor"],
            "links": { "detail": "./tools/imranai-social-video-downloader.html", "launch": "./tools/imranai-social-video-downloader.html" }
        },
        {
            "id": "imranai-video-studio",
            "name": "ImranAI Video & Reverse Prompt Studio",
            "description": "Full-stack AI video creation platform featuring inverse video reverse prompting, voice synthesis, multi-track timeline editing, and automated script-to-video workflow.",
            "category": "video-ai",
            "status": "LIVE APP",
            "statusClass": "status-live",
            "icon": "fa-solid fa-wand-magic-sparkles",
            "tags": ["FastAPI", "React", "Reverse Prompting", "TTS"],
            "links": { "detail": "./tools/imranai-video-studio.html", "launch": "./tools/imranai-video-studio.html" }
        }
    ];
}
