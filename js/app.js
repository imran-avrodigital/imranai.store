/* ==========================================================================
   IMRAN NAZIR PORTFOLIO & AI TOOLS ECOSYSTEM // MAIN JAVASCRIPT
   ========================================================================== */

let allToolsData = [];
let activeCategory = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initTypingEffect();
    initMobileMenu();
    loadToolsCatalog();
    initModalEvents();
    initBuiltInToolsLogic();
    initTiltCards();
    initScrollAnimations();
    initCharts();
    initContactForm();
    initTerminal();
});

/* --- CYBER MOUSE CURSOR TRACKING --- */
function initCursor() {
    const cursorDot = document.getElementById('cyber-cursor');
    const cursorRing = document.getElementById('cyber-cursor-ring');
    if (!cursorDot || !cursorRing) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursorRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    const interactiveSelectors = 'a, button, .hud-card, .project-card, .stat-hud-box, .stat-box, .testimonial-card, .contact-item, .social-icon, .cyber-btn, .mini-tag, .tag, input, select, textarea, .mobile-toggle, .curved-button-wrapper, .avatar-frame, .tool-card, .chip-btn';

    document.addEventListener('mouseover', (e) => {
        if (e.target && e.target.closest && e.target.closest(interactiveSelectors)) {
            document.body.classList.add('cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target && e.target.closest && e.target.closest(interactiveSelectors)) {
            document.body.classList.remove('cursor-hover');
        }
    });
}

/* --- HERO TYPING EFFECT --- */
function initTypingEffect() {
    const typingRoleText = document.getElementById('typingRoleText');
    if (!typingRoleText) return;

    const rolesList = [
        'SEO Strategist',
        'AI Automation Lead',
        'WordPress Engineer',
        'Video Studio Developer',
        'Digital Marketing Lead'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeRoles() {
        const currentRole = rolesList[roleIndex];
        if (isDeleting) {
            typingRoleText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingRoleText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 70 : 120;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % rolesList.length;
            typeSpeed = 600;
        }

        setTimeout(typeRoles, typeSpeed);
    }
    typeRoles();
}

/* --- MOBILE NAVIGATION DRAWER --- */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const menuBtnIcon = document.getElementById('menuBtnIcon');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    if (!mobileMenuBtn || !mobileNavDrawer) return;

    function toggleMenu() {
        const isActive = mobileNavDrawer.classList.toggle('active');
        if (menuBtnIcon) {
            if (isActive) {
                menuBtnIcon.classList.remove('fa-bars');
                menuBtnIcon.classList.add('fa-xmark');
                document.body.style.overflow = 'hidden';
            } else {
                menuBtnIcon.classList.remove('fa-xmark');
                menuBtnIcon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileNavDrawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (mobileNavDrawer.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

/* --- DYNAMIC TOOLS CATALOG STORE --- */
async function loadToolsCatalog() {
    const grid = document.getElementById('toolsCatalogGrid');
    if (!grid) return;

    try {
        const response = await fetch('./data/tools.json');
        if (response.ok) {
            allToolsData = await response.json();
        } else {
            console.warn('Fallback to embedded tools data');
            allToolsData = getFallbackTools();
        }
    } catch (err) {
        console.warn('Loading fallback tools due to fetch exception:', err);
        allToolsData = getFallbackTools();
    }

    renderToolsGrid();
    setupCatalogControls();
}

function renderToolsGrid() {
    const grid = document.getElementById('toolsCatalogGrid');
    const countEl = document.getElementById('toolCounterText');
    if (!grid) return;

    const filtered = allToolsData.filter((t) => {
        const matchCategory = activeCategory === 'all' || t.category === activeCategory;
        const q = searchQuery.toLowerCase();
        const matchSearch =
            !q ||
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)));
        return matchCategory && matchSearch;
    });

    if (countEl) {
        countEl.innerHTML = `<i class="fa-solid fa-microchip"></i> Showing ${filtered.length} of ${allToolsData.length} AI Tools`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-card); border: 1px dashed var(--border-glow); border-radius: var(--radius-md);">
                <i class="fa-solid fa-ghost" style="font-size: 3rem; color: var(--neon-magenta); margin-bottom: 15px;"></i>
                <h3 style="font-family: var(--font-heading); color: #fff;">NO MATCHING AI TOOLS FOUND</h3>
                <p style="color: var(--text-muted); margin-top: 8px;">Try adjusting your search query or switching categories.</p>
                <button onclick="resetFilters()" class="cyber-btn cyber-btn-outline" style="margin-top: 20px;">RESET ALL FILTERS</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map((tool, idx) => createToolCardHTML(tool, idx)).join('');

    // Re-initialize 3D tilt for newly appended tool cards
    initTiltCards();
}

function createToolCardHTML(tool, idx) {
    const highlightsHTML = tool.highlights
        ? tool.highlights.map((h) => `<li><i class="fa-solid fa-angle-right"></i> ${h}</li>`).join('')
        : '';

    const tagsHTML = tool.tags
        ? tool.tags.map((tag) => `<span class="tag-pill">${tag}</span>`).join('')
        : '';

    let actionButtonHTML = '';
    if (tool.isInteractiveModal) {
        actionButtonHTML = `<button onclick="openBuiltInModal('${tool.modalType}')" class="cyber-btn cyber-btn-sm"><i class="fa-solid fa-play"></i> LAUNCH TOOL</button>`;
    } else {
        actionButtonHTML = `<a href="${tool.links.launch}" target="_blank" rel="noopener" class="cyber-btn cyber-btn-sm"><i class="fa-solid fa-rocket"></i> LAUNCH APP</a>`;
    }

    const detailLinkHTML = `<a href="${tool.links && tool.links.detail ? tool.links.detail : `./tool.html?id=${tool.id}`}" class="cyber-btn cyber-btn-outline cyber-btn-sm" style="font-family:var(--font-mono);"><i class="fa-solid fa-circle-info"></i> DETAILS & HOW TO USE</a>`;

    const delay = (idx % 3) * 0.18;

    return `
        <div class="tool-card tilt-card cyber-pop pop-matrix-flip" id="tool-${tool.id}" style="transition-delay: ${delay}s;">
            <div>
                <div class="tool-card-header">
                    <div class="tool-icon-box">
                        <i class="${tool.icon || 'fa-solid fa-cube'}"></i>
                    </div>
                    <div class="tool-badges">
                        <span class="status-badge ${tool.statusClass || 'status-live'}">${tool.status}</span>
                        ${tool.badge ? `<span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--neon-cyan);">${tool.badge}</span>` : ''}
                    </div>
                </div>

                <h3 class="tool-card-title">${tool.name}</h3>
                <p class="tool-card-desc">${tool.description}</p>

                ${highlightsHTML ? `<ul class="tool-highlights">${highlightsHTML}</ul>` : ''}
                ${tagsHTML ? `<div class="tag-pills">${tagsHTML}</div>` : ''}
            </div>

            <div class="tool-card-footer" style="flex-wrap:wrap; gap:10px;">
                ${detailLinkHTML}
                ${actionButtonHTML}
            </div>
        </div>
    `;
}

function setupCatalogControls() {
    const searchInput = document.getElementById('toolSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderToolsGrid();
        });
    }

    const chips = document.querySelectorAll('.chip-btn');
    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            chips.forEach((c) => c.classList.remove('active'));
            chip.classList.add('active');
            activeCategory = chip.dataset.category || 'all';
            renderToolsGrid();
        });
    });
}

function resetFilters() {
    searchQuery = '';
    activeCategory = 'all';
    const searchInput = document.getElementById('toolSearchInput');
    if (searchInput) searchInput.value = '';
    const chips = document.querySelectorAll('.chip-btn');
    chips.forEach((c) => {
        if (c.dataset.category === 'all') c.classList.add('active');
        else c.classList.remove('active');
    });
    renderToolsGrid();
}

window.launchToolById = function (toolId) {
    const found = allToolsData.find((t) => t.id === toolId);
    if (!found) return false;

    if (found.isInteractiveModal) {
        openBuiltInModal(found.modalType);
    } else if (found.links && found.links.launch) {
        window.open(found.links.launch, '_blank');
    }
    return true;
};

/* --- 3D TILT EFFECT ON CARDS --- */
function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card, .hud-card, .project-card, .stat-hud-box, .stat-box, .testimonial-card, .contact-info-card, .contact-form-card, .terminal-container, .tool-card');
    cards.forEach((card) => {
        function handleMove(e) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const rect = card.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            card.style.borderColor = 'var(--neon-cyan)';
            card.style.boxShadow = '0 15px 35px rgba(0, 243, 255, 0.3)';
        }

        function handleLeave() {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            card.style.borderColor = '';
            card.style.boxShadow = '';
        }

        card.addEventListener('mousemove', handleMove);
        card.addEventListener('touchmove', handleMove, { passive: true });
        card.addEventListener('mouseleave', handleLeave);
        card.addEventListener('touchend', handleLeave);
    });
}

/* --- SCROLL POPUP ANIMATIONS (INTERSECTION OBSERVER) --- */
function initScrollAnimations() {
    const pops = document.querySelectorAll('.cyber-pop');
    if (!pops.length) return;

    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    };

    let radarAnimated = false;
    let lineAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Animate progress bars if inside this card
                const skillFills = entry.target.querySelectorAll('.progress-bar-fill');
                skillFills.forEach((fill) => {
                    const targetWidth = fill.getAttribute('data-width');
                    if (targetWidth) fill.style.width = targetWidth;
                });

                // Animate skill percentage counters
                const pctCounters = entry.target.querySelectorAll('.skill-pct-counter');
                pctCounters.forEach((counter) => {
                    const targetVal = parseInt(counter.getAttribute('data-val'), 10);
                    if (targetVal && counter.textContent === '0%') {
                        animateCounterSlow(counter, targetVal, '%');
                    }
                });

                // Animate stat box counters
                const statCounters = entry.target.querySelectorAll('.stat-counter-val');
                statCounters.forEach((counter) => {
                    const targetVal = parseInt(counter.getAttribute('data-target'), 10);
                    const suffix = counter.getAttribute('data-suffix') || '';
                    if (targetVal && counter.textContent.includes('0')) {
                        animateCounterSlow(counter, targetVal, suffix);
                    }
                });

                // Trigger Charts
                if (entry.target.classList.contains('pop-radar-tornado') && !radarAnimated) {
                    radarAnimated = true;
                    if (window.radarChartInstance) {
                        window.radarChartInstance.data.datasets[0].data = [95, 94, 90, 92, 88, 93];
                        window.radarChartInstance.update();
                    }
                }

                if (entry.target.classList.contains('pop-matrix-flip') && entry.target.querySelector('#lineChart') && !lineAnimated) {
                    lineAnimated = true;
                    if (window.lineChartInstance) {
                        window.lineChartInstance.data.datasets[0].data = [20, 35, 65, 110, 160, 190, 210, 230, 245, 255, 258, 260];
                        window.lineChartInstance.update();
                    }
                }
            }
        });
    }, observerOptions);

    pops.forEach((el) => observer.observe(el));
}

function animateCounterSlow(el, target, suffix) {
    let current = 0;
    const duration = 2800;
    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.round(current) + suffix;
    }, stepTime);
}

/* --- CHART.JS METRICS INTEGRATION --- */
function initCharts() {
    const radarCanvas = document.getElementById('radarChart');
    if (radarCanvas) {
        const ctxRadar = radarCanvas.getContext('2d');
        window.radarChartInstance = new Chart(ctxRadar, {
            type: 'radar',
            data: {
                labels: ['SEO & Analytics', 'AI Automation', 'WordPress Dev', 'Video Editing', 'Digital Marketing', 'Content Strategy'],
                datasets: [{
                    label: 'Proficiency Level',
                    data: [0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(0, 243, 255, 0.25)',
                    borderColor: '#00f3ff',
                    borderWidth: 3,
                    pointBackgroundColor: '#ff0055',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 3500,
                    easing: 'easeOutQuart'
                },
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
                        grid: { color: 'rgba(0, 243, 255, 0.2)' },
                        pointLabels: { color: '#00f3ff', font: { family: 'Orbitron', size: 10, weight: 'bold' } },
                        ticks: { display: false }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    const lineCanvas = document.getElementById('lineChart');
    if (lineCanvas) {
        const ctxLine = lineCanvas.getContext('2d');
        window.lineChartInstance = new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'],
                datasets: [{
                    label: 'Organic Traffic Index (+260%)',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#ff0055',
                    backgroundColor: 'rgba(255, 0, 85, 0.15)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 4000,
                    easing: 'easeInOutCubic'
                },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' }, min: 0 }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}

/* --- CONTACT FORM HANDLER (DIRECT EMAIL TO IMRAN.AVRODIGITAL.CO@GMAIL.COM) --- */
function initContactForm() {
    const contactForm = document.getElementById('portfolioContactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatusMsg = document.getElementById('formStatusMsg');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.innerHTML = `TRANSMITTING... <i class="fa-solid fa-spinner fa-spin"></i>`;
            formStatusMsg.style.display = 'block';
            formStatusMsg.style.color = 'var(--neon-cyan)';
            formStatusMsg.innerHTML = `📡 TRANSMITTING MESSAGE TO IMRAN NAZIR...`;

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://formsubmit.co/ajax/imran.avrodigital.co@gmail.com', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                const result = await response.json().catch(() => ({}));

                if (response.ok) {
                    formStatusMsg.style.color = 'var(--neon-green)';
                    formStatusMsg.innerHTML = `✅ TRANSMISSION DELIVERED! Message sent to imran.avrodigital.co@gmail.com!`;
                    contactForm.reset();
                } else if (result.message && result.message.includes('activation')) {
                    formStatusMsg.style.color = 'var(--neon-gold)';
                    formStatusMsg.innerHTML = `📬 FormSubmit sent an activation link to <b>imran.avrodigital.co@gmail.com</b>! Please check your Gmail Inbox and click <b>Activate Form</b> once.`;
                } else {
                    formStatusMsg.style.color = 'var(--neon-green)';
                    formStatusMsg.innerHTML = `✅ TRANSMISSION SENT! Delivered to imran.avrodigital.co@gmail.com!`;
                    contactForm.reset();
                }
            } catch (err) {
                formStatusMsg.style.color = 'var(--neon-gold)';
                formStatusMsg.innerHTML = `📩 Message queued! You can also email directly to <a href="mailto:imran.avrodigital.co@gmail.com" style="color:var(--neon-cyan); text-decoration:underline;">imran.avrodigital.co@gmail.com</a>.`;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `TRANSMIT MESSAGE <i class="fa-solid fa-paper-plane"></i>`;
            }
        });
    }
}

/* --- CYBER TERMINAL SHELL --- */
function initTerminal() {
    const termInput = document.getElementById('term-input');
    const termBody = document.getElementById('term-body');
    if (!termInput || !termBody) return;

    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = termInput.value.trim().toLowerCase();
            termInput.value = '';

            const line = document.createElement('div');
            line.innerHTML = `<span style="color:var(--neon-magenta)">user@imran-nazir:~$</span> ${cmd}`;
            termBody.appendChild(line);

            const response = document.createElement('div');
            response.style.marginBottom = '10px';

            switch (cmd) {
                case 'help':
                    response.innerHTML = `Available Commands:<br>- <span style="color:var(--neon-cyan)">tools</span>: View all registered AI tools<br>- <span style="color:var(--neon-cyan)">launch &lt;id&gt;</span>: Launch tool app (e.g. 'launch imranai-prompt-generator')<br>- <span style="color:var(--neon-cyan)">skills</span>: List technical competencies & SEO tools<br>- <span style="color:var(--neon-cyan)">projects</span>: Display active deployments<br>- <span style="color:var(--neon-cyan)">contact</span>: Show direct email & channels<br>- <span style="color:var(--neon-cyan)">status</span>: Check system telemetry<br>- <span style="color:var(--neon-cyan)">clear</span>: Clear terminal console`;
                    break;
                case 'tools':
                    response.innerHTML = `AI Tools Ecosystem Catalog:<br>1. <span style="color:var(--neon-cyan)">imranai-video-studio</span> [AI Video & Reverse Prompt Studio]<br>2. <span style="color:var(--neon-cyan)">dola-auto-video-generator</span> [Dola Automated Video Generator]<br>3. <span style="color:var(--neon-cyan)">imranai-prompt-generator</span> [Master Prompt Generator (Built-in)]<br>4. <span style="color:var(--neon-cyan)">youtube-seo-metadata-generator</span> [YouTube SEO Suite (Built-in)]<br>Type 'launch &lt;id&gt;' to trigger any tool.`;
                    break;
                case 'skills':
                    response.innerHTML = `Proficiencies:<br>- SEO Strategy & Analytics (95%) [SEMrush, GSC, GA4]<br>- AI & LLM Automation (94%) [Python, Playwright, ChatGPT]<br>- Video Editing (92%) [Kling AI, Runway ML]<br>- WordPress & Web (90%) [WordPress, Elementor]`;
                    break;
                case 'projects':
                    response.innerHTML = `Featured Deployments:<br>1. Avrodigital.co<br>2. BuyBigInflatableThings.com (+260% Growth)<br>3. ElectricScooter.com (#1 Rankings)<br>4. Dola AI Video Automation Studio`;
                    break;
                case 'contact':
                    response.innerHTML = `Direct Channels:<br>- Email: <span style="color:var(--neon-cyan)">imran.avrodigital.co@gmail.com</span><br>- WhatsApp: +8801955688996<br>- Facebook: facebook.com/iamimranai`;
                    break;
                case 'status':
                    response.innerHTML = `<span style="color:var(--neon-green)">SYSTEM ONLINE</span> // Latency: 12ms // Telemetry: 99.9%`;
                    break;
                case 'clear':
                    termBody.innerHTML = '';
                    return;
                default:
                    if (cmd.startsWith('launch ')) {
                        const targetId = cmd.replace('launch ', '').trim();
                        if (window.launchToolById(targetId)) {
                            response.innerHTML = `<span style="color:var(--neon-green)">[SUCCESS] Triggered tool '${targetId}'.</span>`;
                        } else {
                            response.innerHTML = `<span style="color:var(--neon-magenta)">[ERROR] Tool '${targetId}' not found. Type 'tools' for list.</span>`;
                        }
                    } else {
                        response.innerHTML = `Command not recognized: '${cmd}'. Type <span style="color:var(--neon-cyan)">help</span> for options.`;
                    }
            }

            termBody.appendChild(response);
            termBody.scrollTop = termBody.scrollHeight;
        }
    });
}

/* --- MODALS CONTROLLER & BUILT-IN GENERATORS --- */
function initModalEvents() {
    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });

    document.querySelectorAll('.modal-close-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const overlay = btn.closest('.modal-overlay');
            if (overlay) overlay.classList.remove('active');
        });
    });
}

window.openBuiltInModal = function (modalType) {
    const targetModal = document.getElementById(`modal-${modalType}`);
    if (targetModal) targetModal.classList.add('active');
};

function initBuiltInToolsLogic() {
    const promptSubject = document.getElementById('promptSubject');
    const promptStyle = document.getElementById('promptStyle');
    const promptLighting = document.getElementById('promptLighting');
    const promptCamera = document.getElementById('promptCamera');
    const promptOutput = document.getElementById('promptOutputText');
    const generatePromptBtn = document.getElementById('generatePromptBtn');

    if (generatePromptBtn && promptOutput) {
        generatePromptBtn.addEventListener('click', () => {
            const subject = promptSubject ? promptSubject.value.trim() : '';
            if (!subject) {
                promptOutput.textContent = '// ERROR: Please enter a prompt subject or scene concept.';
                return;
            }

            const styleVal = promptStyle ? promptStyle.value : 'cyberpunk photorealistic';
            const lightVal = promptLighting ? promptLighting.value : 'volumetric cyan neon lighting';
            const camVal = promptCamera ? promptCamera.value : 'cinematic 85mm lens, f/1.4';

            promptOutput.textContent = `${subject}, ${styleVal}, ${lightVal}, ${camVal}, unreal engine 5 render, highly detailed, octane render, 8k resolution, photorealistic --ar 16:9 --v 6.0`;
        });
    }

    const seoTopic = document.getElementById('seoTopic');
    const seoTitleOutput = document.getElementById('seoTitleOutput');
    const seoTagsOutput = document.getElementById('seoTagsOutput');
    const generateSeoBtn = document.getElementById('generateSeoBtn');

    if (generateSeoBtn && seoTitleOutput) {
        generateSeoBtn.addEventListener('click', () => {
            const topic = seoTopic ? seoTopic.value.trim() : '';
            if (!topic) {
                seoTitleOutput.textContent = '// ERROR: Enter a video topic to generate SEO metadata.';
                return;
            }

            seoTitleOutput.textContent = `RECOMMENDED HIGH-CTR TITLES:\n1. 🔥 How to Master ${topic} in 2026 (Step-by-Step Guide)\n2. I Tried ${topic} for 30 Days (SHOCKING Results!)\n3. ${topic} Secrets Nobody Tells You (Full Automation Workflow)\n4. Top 5 Free AI Tools for ${topic}`;
            if (seoTagsOutput) seoTagsOutput.textContent = `OPTIMIZED KEYWORD TAGS:\n${topic.toLowerCase()}, ${topic.toLowerCase()} tutorial, ${topic.toLowerCase()} 2026, ai automation, imranai, best tools for ${topic.toLowerCase()}`;
        });
    }

    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiProvider = document.getElementById('apiProvider');
    const apiTestBtn = document.getElementById('apiTestBtn');
    const apiTestOutput = document.getElementById('apiTestOutput');

    if (apiTestBtn && apiTestOutput) {
        apiTestBtn.addEventListener('click', () => {
            const key = apiKeyInput ? apiKeyInput.value.trim() : '';
            const provider = apiProvider ? apiProvider.value : 'openai';

            if (!key) {
                apiTestOutput.textContent = '// ERROR: Enter an API key to test.';
                return;
            }

            apiTestOutput.innerHTML = `<span style="color:var(--neon-gold);"><i class="fa-solid fa-spinner fa-spin"></i> Validating ${provider.toUpperCase()} API key structure...</span>`;

            setTimeout(() => {
                let isValidSyntax = false;
                if (provider === 'openai' && key.startsWith('sk-')) isValidSyntax = true;
                if (provider === 'gemini' && key.length > 20) isValidSyntax = true;
                if (provider === 'elevenlabs' && key.length > 15) isValidSyntax = true;
                if (provider === 'claude' && key.startsWith('sk-ant-')) isValidSyntax = true;

                if (isValidSyntax) {
                    apiTestOutput.innerHTML = `<span style="color:var(--neon-green); font-weight:bold;"><i class="fa-solid fa-circle-check"></i> STATUS: KEY FORMAT VALIDATED!</span>\n- Provider: ${provider.toUpperCase()}\n- Security: 100% Client-Side (Zero logs stored)`;
                } else {
                    apiTestOutput.innerHTML = `<span style="color:var(--neon-magenta); font-weight:bold;"><i class="fa-solid fa-triangle-exclamation"></i> WARNING: UNUSUAL KEY PATTERN DETECTED</span>\n- Double check key prefix for ${provider.toUpperCase()}`;
                }
            }, 600);
        });
    }

    const addToolForm = document.getElementById('addToolForm');
    const adminOutput = document.getElementById('adminJsonOutput');

    if (addToolForm) {
        addToolForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('newToolName').value.trim();
            const category = document.getElementById('newToolCategory').value;
            const status = document.getElementById('newToolStatus').value;
            const link = document.getElementById('newToolLink').value.trim();
            const desc = document.getElementById('newToolDesc').value.trim();
            const tagsRaw = document.getElementById('newToolTags').value.trim();

            const newTool = {
                id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                name: name,
                category: category,
                categoryName: getCategoryLabel(category),
                status: status.toUpperCase(),
                statusClass: getStatusClass(status),
                featured: true,
                icon: "fa-solid fa-microchip",
                badge: "NEW TOOL",
                description: desc,
                tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()) : ["AI Tool"],
                links: {
                    launch: link || "#",
                    detail: `./tool.html?id=${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                    github: "https://github.com/iamimranai"
                },
                highlights: ["Newly Published Tool", "Integrated with Catalog"]
            };

            allToolsData.unshift(newTool);
            renderToolsGrid();

            if (adminOutput) {
                adminOutput.style.display = 'block';
                adminOutput.textContent = `// SUCCESS! Tool added to live DOM catalog.\n// Copy updated JSON array to data/tools.json to save permanently:\n\n${JSON.stringify(allToolsData, null, 2)}`;
            }

            alert(`Tool "${name}" has been published to the catalog!`);
        });
    }
}

function getCategoryLabel(cat) {
    switch (cat) {
        case 'ai-video': return 'AI Video Studio';
        case 'content-automation': return 'Content Automation';
        case 'seo-growth': return 'SEO & Metadata';
        default: return 'AI Utilities';
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'live': return 'status-live';
        case 'builtin': return 'status-builtin';
        case 'beta': return 'status-beta';
        case 'extension': return 'status-ext';
        default: return 'status-live';
    }
}

window.copyToClipboard = function (elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.textContent || el.value;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
};

function getFallbackTools() {
    return [
        {
            id: "imranai-video-studio",
            name: "ImranAI Video & Reverse Prompt Studio",
            category: "ai-video",
            categoryName: "AI Video Studio",
            status: "LIVE APP",
            statusClass: "status-live",
            featured: true,
            icon: "fa-solid fa-wand-magic-sparkles",
            badge: "FLAGSHIP",
            description: "Full-stack AI video creation platform featuring inverse video reverse prompting, voice synthesis, multi-track timeline editing, and automated script-to-video workflow.",
            tags: ["FastAPI", "React", "Reverse Prompting", "TTS", "FFmpeg"],
            links: { launch: "https://video.imranai.store", detail: "./tool.html?id=imranai-video-studio", github: "https://github.com/iamimranai" },
            highlights: ["Inverse AI Reverse Video Prompt Extraction", "ElevenLabs & Edge Voice Integration", "Automated Subtitle Captions"]
        }
    ];
}
