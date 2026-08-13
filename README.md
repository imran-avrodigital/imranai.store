# ⚡ IMRAN AI // AI Tools Ecosystem & Portfolio (`imranai.store`)

Welcome to the official source repository for **[imranai.store](https://imranai.store)** — a futuristic, high-performance AI tools directory and portfolio website built for **Imran Nazir**.

---

## 🎨 Features & Highlights

- **Branded Design Identity**: Includes the official cyan glow polygon + 3D metallic silver mark logo (`assets/logo.svg`) and favicon (`assets/favicon.svg`).
- **Dynamic AI Tools Directory**: Displays all your tools with category filters, live search, status badges (`LIVE APP`, `BUILT-IN`, `BETA`, `CHROME EXTENSION`), and launch CTAs.
- **Built-in Interactive Micro-Tools**:
  - **Master AI Prompt Generator** (Midjourney, Flux, Sora, ChatGPT)
  - **YouTube & Video SEO Metadata Generator** (Titles, tags, hashtags)
  - **Multi-Provider API Key Validator** (Client-side OpenAI, Gemini, ElevenLabs validator)
  - **Admin Tool Publisher Modal** (Add new tools to your catalog dynamically!)
- **Cyberpunk IA-OS Terminal**: Interactive command terminal supporting `help`, `tools`, `skills`, `about`, `contact`, `status`, and `launch <tool-id>`.
- **FormSubmit Contact Integration**: Direct email handling for client inquiries (`iamimranai.com@gmail.com`).
- **Zero-Dependency Vercel Deployment**: 100% pure HTML5, modern Vanilla CSS (design tokens & glassmorphism), and modular JS.

---

## 📁 Repository Directory Structure

```
imranai_store/
├── index.html              # Main Hub & Portfolio Page
├── vercel.json             # Vercel Configuration (Headers, Clean URLs)
├── package.json            # Project Metadata
├── _redirects              # Static Hosting Redirect Rules
├── assets/
│   ├── logo.svg            # Official Imran AI Logo (Cyan + Metallic Silver)
│   ├── favicon.svg         # Official Favicon Vector
│   └── profile.png         # Profile Image
├── css/
│   └── style.css           # Futuristic Cyberpunk Design Tokens & Utilities
├── js/
│   ├── app.js              # Catalog Controller & Interactive Tool Modals
│   ├── particles.js        # Background Canvas Glowing Node Animation
│   └── terminal.js         # IA-OS Terminal Shell Emulator
└── data/
    └── tools.json          # Master Dataset of all AI Tools
```

---

## 🚀 How to Deploy to GitHub & Vercel (`imranai.store`)

### Step 1: Copy Files to your GitHub Repository Folder
1. Copy all contents of `imranai_store` into your local Git repository folder.
2. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Initial commit for imranai.store"
   git push origin main
   ```

### Step 2: Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
2. Import your GitHub repository.
3. Keep default settings (Framework Preset: **Other / Static**).
4. Click **Deploy**.

### Step 3: Connect Custom Domain (`imranai.store`)
1. In your Vercel project dashboard, go to **Settings -> Domains**.
2. Add `imranai.store` and `www.imranai.store`.
3. Update your domain registrar DNS settings (Nameservers or A/CNAME records provided by Vercel).
4. Vercel automatically generates a free SSL certificate!

---

## ➕ How to Add More Tools in the Future

### Method A: Via Web Admin Panel (No Coding Required)
1. Visit `imranai.store` and click **"+ ADD TOOL"** in the top navigation bar.
2. Fill out the tool details (Name, Category, Status, Link, Description, Tags).
3. Click **Publish Tool**. It will instantly show in your live website catalog!
4. Copy the generated JSON snippet into `data/tools.json` and push to GitHub to save permanently.

### Method B: Directly Edit `data/tools.json`
Open `data/tools.json` and add a new tool object:
```json
{
  "id": "my-new-tool",
  "name": "My New AI Tool",
  "category": "ai-video",
  "categoryName": "AI Video Studio",
  "status": "LIVE APP",
  "statusClass": "status-live",
  "featured": true,
  "icon": "fa-solid fa-wand-magic-sparkles",
  "description": "Tool description here...",
  "tags": ["AI", "Python"],
  "links": {
    "launch": "https://newtool.imranai.store",
    "github": "https://github.com/iamimranai"
  }
}
```
Commit and push — Vercel updates the site automatically in seconds!
