/* ==========================================================================
   IMRANAI.STORE // MAIN APPLICATION LOGIC
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
});

/* --- CYBER MOUSE CURSOR TRACKING --- */
function initCursor() {
    const cursor = document.getElementById('cyber-cursor');
    const ring = document.getElementById('cyber-cursor-ring');
    if (!cursor || !ring) return;

    window.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        ring.style.left = `${e.clientX}px`;
        ring.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll('a, button, input, textarea, select, .tool-card, .chip-btn').forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

/* --- HERO TYPING EFFECT --- */
function initTypingEffect() {
    const el = document.getElementById('typingRoleText');
    if (!el) return;

    const roles = [
        "AI Tool Builder & Architect",
        "SEO Automation Lead",
        "Full-Stack Web Engineer",
        "Python AI Studio Developer",
        "YouTube Growth Strategist"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            el.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    type();
}

/* --- MOBILE NAVIGATION --- */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileNavDrawer');
    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', () => {
        drawer.classList.toggle('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        }
    });

    drawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            drawer.classList.remove('active');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        });
    });
}

/* --- DYNAMIC TOOLS CATALOG RENDER --- */
async function loadToolsCatalog() {
    const grid = document.getElementById('toolsCatalogGrid');
    if (!grid) return;

    try {
        const response = await fetch('./data/tools.json');
        if (response.ok) {
            allToolsData = await response.json();
        } else {
            console.warn('Fallback to embedded default tools dataset');
            allToolsData = getFallbackTools();
        }
    } catch (err) {
        console.warn('Loading fallback tools due to fetch:', err);
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
        countEl.textContent = `Showing ${filtered.length} of ${allToolsData.length} AI Tools`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-card); border: 1px dashed var(--border-glow); border-radius: var(--radius-md);">
                <i class="fa-solid fa-ghost" style="font-size: 3rem; color: var(--neon-magenta); margin-bottom: 15px;"></i>
                <h3 style="font-family: var(--font-heading); color: #fff;">NO AI TOOLS FOUND MATCHING CRITERIA</h3>
                <p style="color: var(--text-muted); margin-top: 8px;">Try adjusting your search query or switching categories.</p>
                <button onclick="resetFilters()" class="cyber-btn cyber-btn-outline" style="margin-top: 20px;">RESET ALL FILTERS</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map((tool) => createToolCardHTML(tool)).join('');

    // Re-attach hover cursor listeners for new dynamic DOM nodes
    document.querySelectorAll('.tool-card, .cyber-btn').forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

function createToolCardHTML(tool) {
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
        actionButtonHTML = `<a href="${tool.links.launch}" target="_blank" rel="noopener" class="cyber-btn cyber-btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> LAUNCH APP</a>`;
    }

    return `
        <div class="tool-card" id="tool-${tool.id}">
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

            <div class="tool-card-footer">
                <span style="font-family:var(--font-mono); font-size:0.78rem; color:var(--text-muted);">${tool.categoryName || 'AI Tool'}</span>
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

/* --- MODALS CONTROLLER --- */
function initModalEvents() {
    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
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
    if (targetModal) {
        targetModal.classList.add('active');
    }
};

window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
};

/* --- BUILT-IN TOOLS INTERACTIVE LOGIC --- */
function initBuiltInToolsLogic() {
    // 1. AI Prompt Generator Logic
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

            const result = `${subject}, ${styleVal}, ${lightVal}, ${camVal}, unreal engine 5 render, highly detailed, octane render, 8k resolution, photorealistic, vibrant color grading --ar 16:9 --v 6.0`;
            promptOutput.textContent = result;
        });
    }

    // 2. YouTube SEO Generator Logic
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

            const titles = [
                `🔥 How to Master ${topic} in 2026 (Step-by-Step Guide)`,
                `I Tried ${topic} for 30 Days (SHOCKING Results!)`,
                `${topic} Secrets Nobody Tells You (Full Automation Workflow)`,
                `Top 5 Free AI Tools for ${topic} That Will Save You Hours`
            ];

            const tags = `${topic.toLowerCase()}, ${topic.toLowerCase()} tutorial, ${topic.toLowerCase()} 2026, ai automation, imranai, best tools for ${topic.toLowerCase()}, how to build ${topic.toLowerCase()}`;

            seoTitleOutput.textContent = `RECOMMENDED HIGH-CTR TITLES:\n1. ${titles[0]}\n2. ${titles[1]}\n3. ${titles[2]}\n4. ${titles[3]}`;
            if (seoTagsOutput) seoTagsOutput.textContent = `OPTIMIZED KEYWORD TAGS:\n${tags}`;
        });
    }

    // 3. API Key Validator Logic
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

            apiTestOutput.innerHTML = `<span style="color:var(--neon-gold);"><i class="fa-solid fa-spinner fa-spin"></i> Validating ${provider.toUpperCase()} API key structure & syntax...</span>`;

            setTimeout(() => {
                let isValidSyntax = false;
                if (provider === 'openai' && key.startsWith('sk-')) isValidSyntax = true;
                if (provider === 'gemini' && key.length > 25) isValidSyntax = true;
                if (provider === 'elevenlabs' && key.length > 20) isValidSyntax = true;
                if (provider === 'claude' && key.startsWith('sk-ant-')) isValidSyntax = true;

                if (isValidSyntax) {
                    apiTestOutput.innerHTML = `
                        <span style="color:var(--neon-green); font-weight:bold;"><i class="fa-solid fa-circle-check"></i> STATUS: KEY FORMAT VALIDATED!</span>\n
                        - Provider: ${provider.toUpperCase()}\n
                        - Key Prefix: ${key.substring(0, 7)}...\n
                        - Security Check: 100% Client-Side (Zero logs stored)\n
                        - Recommendation: Key structure matches official SDK specs.
                    `;
                } else {
                    apiTestOutput.innerHTML = `
                        <span style="color:var(--neon-magenta); font-weight:bold;"><i class="fa-solid fa-triangle-exclamation"></i> WARNING: UNUSUAL KEY PATTERN DETECTED</span>\n
                        - Provider: ${provider.toUpperCase()}\n
                        - Verification Notice: Double check if key prefix or length matches ${provider.toUpperCase()} dashboard.
                    `;
                }
            }, 800);
        });
    }

    // 4. Add Custom Tool Admin Form Logic
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
                    docs: "#",
                    github: "https://github.com/iamimranai"
                },
                highlights: ["Newly Published Tool", "Integrated with imranai.store"]
            };

            allToolsData.unshift(newTool);
            renderToolsGrid();

            if (adminOutput) {
                adminOutput.style.display = 'block';
                adminOutput.textContent = `// SUCCESS! Tool added to live DOM catalog.\n// Copy updated JSON array to data/tools.json to save permanently:\n\n${JSON.stringify(allToolsData, null, 2)}`;
            }

            alert(`Tool "${name}" has been successfully added to imranai.store catalog!`);
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
            links: { launch: "https://video.imranai.store", docs: "#", github: "https://github.com/iamimranai" },
            highlights: ["AI Reverse Video Prompt Generation", "ElevenLabs & Edge Voice Integration", "Automated Subtitle Captions"]
        },
        {
            id: "imranai-prompt-generator",
            name: "ImranAI Master Prompt Generator",
            category: "utilities",
            categoryName: "AI Utilities",
            status: "BUILT-IN",
            statusClass: "status-builtin",
            featured: true,
            icon: "fa-solid fa-terminal",
            badge: "BUILT-IN TOOL",
            description: "Engineered prompt synthesis tool designed to create photorealistic Midjourney/Flux image prompts, ChatGPT master system prompts, and Sora video prompts.",
            tags: ["Prompt Engineering", "Midjourney", "ChatGPT", "Flux"],
            isInteractiveModal: true,
            modalType: "promptGenerator",
            links: { launch: "#interactive-prompt-generator", docs: "#", github: "https://github.com/iamimranai" },
            highlights: ["Lighting & Camera Control Controls", "Negative Prompt Filtering", "One-Click Copy & Enhancers"]
        }
    ];
}
