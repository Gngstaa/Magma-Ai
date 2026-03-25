# Magma AI Website — Deployment Guide

## What's in this folder

```
magma-deploy/
├── public/
│   ├── favicon.svg          # Magma logo favicon
│   └── robots.txt           # SEO robots file
├── src/
│   ├── App.jsx              # The entire website
│   └── main.jsx             # React entry point
├── index.html               # HTML with SEO meta tags
├── package.json             # Dependencies
├── vite.config.js           # Build config
├── vercel.json              # Vercel SPA routing
└── .gitignore
```

---

## Option A: Deploy to Vercel (Recommended — Free, 5 minutes)

### Step 1: Install prerequisites
Make sure you have Node.js 18+ installed. Download from https://nodejs.org if needed.

### Step 2: Push to GitHub
```bash
# Navigate to the project folder
cd magma-deploy

# Initialize git
git init
git add .
git commit -m "Magma AI website"

# Create a repo on GitHub (github.com/new), then:
git remote add origin https://github.com/YOUR_USERNAME/magma-ai-website.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Import your `magma-ai-website` repository
4. Vercel auto-detects Vite — just click "Deploy"
5. Wait ~60 seconds. Your site is live!

### Step 4: Connect your domain (magmaai.io)
1. In Vercel, go to your project → Settings → Domains
2. Add `magmaai.io`
3. Vercel will show you DNS records to add. Go to your domain registrar and:
   - **Option A (recommended):** Change nameservers to Vercel's nameservers
   - **Option B:** Add these DNS records:
     - `A` record: `76.76.21.21` (for `magmaai.io`)
     - `CNAME` record: `cname.vercel-dns.com` (for `www.magmaai.io`)
4. Wait 5-30 minutes for DNS propagation
5. Vercel auto-provisions an SSL certificate — your site is live at https://magmaai.io

---

## Option B: Deploy to Netlify (Also free)

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy on Netlify
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy"

### Step 3: Connect domain
1. Go to Site settings → Domain management → Add custom domain
2. Add `magmaai.io`
3. Update DNS at your registrar as Netlify instructs

**Note:** For Netlify, also create this file in the `public` folder:

```
# public/_redirects
/*    /index.html   200
```

---

## Option C: Deploy to Cloudflare Pages (Free, fastest CDN)

1. Go to https://dash.cloudflare.com → Pages
2. Connect your GitHub repo
3. Build settings:
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy, then add your custom domain

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (opens at http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## After Deployment Checklist

- [ ] Verify all pages work (click through every nav link)
- [ ] Test on mobile (responsive design)
- [ ] Add a real OG image (create a 1200x630px image, save as `public/og-image.png`)
- [ ] Update `hello@magma-ai.com` with your real email
- [ ] Connect the contact form to a backend (Formspree, Netlify Forms, or your own API)
- [ ] Set up Google Analytics or Plausible for tracking
- [ ] Submit sitemap to Google Search Console

---

## Connecting the Contact Form

The form currently shows a success message on submit but doesn't send data anywhere.
Here are the easiest options:

### Formspree (Easiest — free for 50 submissions/month)
1. Sign up at https://formspree.io
2. Create a form, get your form ID
3. In `App.jsx`, update the form submit handler to POST to Formspree:

```javascript
const handleSubmit = async () => {
  await fetch("https://formspree.io/f/YOUR_FORM_ID", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  setDone(true);
};
```

### Google Sheets (Free, unlimited)
Use a Google Apps Script as a webhook to receive form data directly into a spreadsheet.

---

## Domain Registrar DNS Settings

If your domain is registered at GoDaddy, Namecheap, Google Domains, etc., 
here's what to change for Vercel:

| Type  | Name | Value                    |
|-------|------|--------------------------|
| A     | @    | 76.76.21.21              |
| CNAME | www  | cname.vercel-dns.com     |

Delete any existing A or CNAME records for @ and www before adding these.
SSL is automatic — no need to buy a certificate.
