/* ==========================================================================
   IA-OS CYBER TERMINAL EMULATOR // IMRANAI.STORE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const termInput = document.getElementById('term-input');
    const termBody = document.getElementById('term-body');
    if (!termInput || !termBody) return;

    const commands = {
        help: `Available Commands:
  - <span class="term-prompt">tools</span> : View all registered AI tools & web apps
  - <span class="term-prompt">launch &lt;id&gt;</span> : Launch tool by ID (e.g. 'launch imranai-prompt-generator')
  - <span class="term-prompt">skills</span> : Inspect Imran AI technical skills & stack
  - <span class="term-prompt">about</span> : Show developer background & credentials
  - <span class="term-prompt">contact</span> : Get direct communication channels
  - <span class="term-prompt">status</span> : System hardware & API network diagnostics
  - <span class="term-prompt">matrix</span> : Run matrix stream simulation
  - <span class="term-prompt">clear</span> : Reset terminal viewport`,

        tools: `Registered AI Tools on imranai.store:
  [1] <span class="term-prompt">imranai-video-studio</span> : Flagship AI Video Creation Suite
  [2] <span class="term-prompt">dola-auto-video-generator</span> : Autonomous Video Render Engine
  [3] <span class="term-prompt">imranai-prompt-generator</span> : Master AI Prompt Synthesis (Built-in)
  [4] <span class="term-prompt">youtube-seo-metadata-generator</span> : High-CTR Metadata Suite (Built-in)
  [5] <span class="term-prompt">imranai-auto-publisher</span> : Cross-platform Social Publisher
  [6] <span class="term-prompt">api-key-tester</span> : Multi-Provider API Key Validator (Built-in)
  Type 'launch <tool-id>' to trigger any tool instantly.`,

        skills: `Technical Core Competencies:
  - <span class="term-prompt">AI & Automation</span>: Python, FastAPI, Node.js, LangChain, Whisper, Reverse Video Prompting
  - <span class="term-prompt">Web Engineering</span>: Modern JS, React, HTML5/CSS3, Tailwind, REST APIs, WebSockets
  - <span class="term-prompt">SEO & Growth</span>: YouTube CTR Optimization, Meta Data Pipelines, Scraping, Keywords Analytics`,

        about: `Imran Nazir // Imran AI Lead Engineer
5+ Years of Experience in AI Automation, SEO Strategy, and Full-Stack Engineering.
Domain Hub: <span class="term-prompt">https://imranai.store</span>`,

        contact: `Direct Communication Links:
  - Email: <span class="term-prompt">iamimranai.com@gmail.com</span>
  - GitHub: https://github.com/iamimranai
  - Domain: https://imranai.store`,

        status: `[SYSTEM DIAGNOSTICS]
  - Core Version: IA-OS v3.0.4 [BUILD 2026]
  - API Gateways: ONLINE (Latency: 14ms)
  - Vercel Edge: ACTIVE // SSL ENCRYPTED
  - Status: ALL SYSTEMS OPERATIONAL`
    };

    function appendLine(text, isInput = false) {
        const line = document.createElement('div');
        line.className = 'term-line';
        if (isInput) {
            line.innerHTML = `<span class="term-prompt">imranai@store:~$</span> ${text}`;
        } else {
            line.innerHTML = text;
        }
        termBody.appendChild(line);
        termBody.scrollTop = termBody.scrollHeight;
    }

    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawVal = termInput.value.trim();
            termInput.value = '';

            if (!rawVal) return;
            appendLine(rawVal, true);

            const args = rawVal.toLowerCase().split(' ');
            const cmd = args[0];

            if (cmd === 'clear') {
                termBody.innerHTML = '<div class="term-line"><span class="term-prompt">IA-OS v3.0</span> Terminal ready. Type <span class="term-prompt">help</span> for commands.</div>';
                return;
            }

            if (cmd === 'launch' && args[1]) {
                const targetId = args[1];
                if (window.launchToolById) {
                    const ok = window.launchToolById(targetId);
                    if (ok) {
                        appendLine(`[SUCCESS] Triggered tool '${targetId}'.`);
                    } else {
                        appendLine(`[ERROR] Tool '${targetId}' not found. Type 'tools' to see valid IDs.`);
                    }
                }
                return;
            }

            if (cmd === 'matrix') {
                appendLine('<span style="color:#00ff66;">01001001 01001101 01010010 01000001 01001110 01000001 01001001 00101110 01010011 01010100 01001111 01000010 01000101</span>');
                return;
            }

            if (commands[cmd]) {
                appendLine(commands[cmd]);
            } else {
                appendLine(`Command not recognized: '${cmd}'. Type <span class="term-prompt">help</span> for commands.`);
            }
        }
    });
});
