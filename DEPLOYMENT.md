# 🚀 Deployment Guide - Cemal Demirci Portfolio

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add your Google Gemini API key
- [ ] Configure admin passwords
- [ ] Set production URLs

### 2. Code Review
- [ ] Test all AI-powered tools locally
- [ ] Verify admin panel functionality
- [ ] Check responsive design on mobile/tablet
- [ ] Test dark mode toggle
- [ ] Verify Zero Density auth (if enabled)

### 3. Build Test
```bash
npm run build
npm run preview
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⚡

**Why Vercel:**
- ✅ Zero configuration for Vite/React
- ✅ Automatic HTTPS
- ✅ CDN & edge caching
- ✅ Instant rollbacks
- ✅ Free tier available

**Steps:**
1. Push code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `VITE_GEMINI_API_KEY`
   - `VITE_ADMIN_PASSWORD`
   - `VITE_AI_UNLIMITED_KEY`
4. Deploy! 🎉

**CLI Deployment:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

### Option 2: Netlify 🦊

**Steps:**
1. Connect GitHub repo to [Netlify](https://netlify.com)
2. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Netlify dashboard
4. Deploy!

**CLI Deployment:**
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

---

### Option 3: Docker Container 🐳

**Already configured!** Use the included Dockerfile.

**Deploy:**
```bash
docker build -t cemal-portfolio .
docker run -p 80:80 cemal-portfolio
```

---

## 🔐 Security Best Practices

### API Keys
- ✅ **NEVER** commit `.env.local` to git
- ✅ Use environment variables on hosting platform
- ✅ Rotate API keys periodically
- ✅ Implement rate limiting (already done ✓)

### Admin Panel
- ✅ Change `ADMIN_PASSWORD` before deployment
- ✅ Use strong secret keys
- ✅ Consider IP whitelisting for `/admin`

---

## 🎯 Production Optimizations

### Already Implemented ✅
- ✓ Code splitting
- ✓ Lazy loading
- ✓ CSS minification
- ✓ Tree shaking
- ✓ Browser caching headers

---

## 🐛 Troubleshooting

### Build Fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working
- Verify variable names start with `VITE_`
- Restart dev server after adding new variables

---

## 🆘 Support

**Contact:**
- Email: cemal.online
- GitHub: https://github.com/cemal-demirci

---

*Built with ❤️ using React, Vite, and Tailwind CSS*
