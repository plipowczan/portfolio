# Deployment Guide

This guide covers deployment options for the Pawel Lipowczan Portfolio website.

## Pre-Deployment Checklist

- [ ] Update personal information in `src/utils/constants.js`
- [ ] Add real project data in `src/data/projects.js`
- [ ] Update skills in `src/data/skills.js`
- [ ] Add blog posts in `src/data/blogPosts.js`
- [ ] Add project images to `public/images/`
- [ ] Test the build: `npm run build`
- [ ] Preview the build: `npm run preview`
- [ ] Update sitemap URLs in `public/sitemap.xml`
- [ ] Update domain in `public/robots.txt`

## Option 1: Vercel (Recommended)

### Why Vercel?

- Zero configuration
- Automatic HTTPS
- Global CDN
- Instant deployments
- Free for personal projects
- Excellent performance

### Steps

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
vercel
```

4. **Production Deployment**

```bash
vercel --prod
```

### Custom Domain

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain
5. Update DNS records as instructed

### Environment Variables (if needed)

1. Go to project settings in Vercel dashboard
2. Navigate to Environment Variables
3. Add any required variables (e.g., API keys)

### ✨ SEO: Prerendering (Recommended)

**⚠️ WAŻNE dla SEO:** Użyj `build:prerender` zamiast standardowego `build`

**W Vercel Dashboard:**

1. Idź do: Settings → General → Build & Development Settings
2. Zmień **Build Command** na:

   ```bash
   npm run build:prerender
   ```

3. **Output Directory** pozostaw: `dist`

**Co to robi?**

- Generuje statyczne HTML dla wszystkich stron
- Google widzi pełną treść (nie pusty `<div id="root"></div>`)
- Znacząco poprawia SEO i pozycje w wyszukiwarkach
- Automatycznie prerenderuje wszystkie posty blogowe

**Build time:** ~2-3 min (vs ~30s bez prerenderingu), ale warto dla SEO!

**Więcej:** Zobacz `../seo/PRERENDERING.md` dla szczegółów

## Option 2: Netlify

### Why Netlify?

- Easy drag-and-drop deployment
- Form handling support
- Free SSL certificates
- Continuous deployment from Git

### Method 1: Drag and Drop

1. Build the project:

```bash
npm run build
```

2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `dist` folder to the upload area
4. Your site is live!

### Method 2: Git Integration

1. Push your code to GitHub
2. Go to [Netlify](https://www.netlify.com/)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Custom Domain on Netlify

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions

## Option 3: GitHub Pages

### Setup

1. Install gh-pages:

```bash
npm install --save-dev gh-pages
```

2. Update `vite.config.js`:

```js
export default defineConfig({
  base: "/repository-name/", // Replace with your repo name
  plugins: [react()],
});
```

3. Add deploy script to `package.json`:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

4. Deploy:

```bash
npm run deploy
```

5. Enable GitHub Pages in repository settings:
   - Settings > Pages
   - Source: gh-pages branch
   - Click Save

## Option 4: Custom Server (VPS/Dedicated)

### Requirements

- Node.js installed
- Nginx or Apache
- SSL certificate (Let's Encrypt recommended)

### Build for Production

```bash
npm run build
```

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name pawellipowczan.com www.pawellipowczan.com;

    root /var/www/portfolio/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### SSL with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d pawellipowczan.com -d www.pawellipowczan.com
```

## Performance Optimization

### Before Deployment

1. **Optimize Images**

   - Compress images (use tools like TinyPNG, Squoosh)
   - Convert to WebP format
   - Resize to appropriate dimensions

2. **Code Splitting**

   - Already implemented with React.lazy()
   - Check bundle size: `npm run build -- --stats`

3. **Remove Console Logs**

   - Search for `console.log` statements
   - Remove or disable in production

4. **Test Performance**
   - Run Lighthouse audit
   - Check bundle size
   - Test on slow 3G network

### After Deployment

1. **Enable CDN** (if using Vercel/Netlify, this is automatic)

2. **Monitor Performance**

   - Google Analytics
   - Google Search Console
   - Web Vitals monitoring

3. **SEO Checklist**
   - Submit sitemap to Google Search Console
   - Verify meta tags are rendering
   - Test Open Graph tags (use [opengraph.xyz](https://www.opengraph.xyz/))
   - Test Twitter Cards (use [Twitter Card Validator](https://cards-dev.twitter.com/validator))

## Environment Variables

If you need API keys or sensitive data:

1. Create `.env` file (already in .gitignore):

```
VITE_API_KEY=your_api_key_here
VITE_FORM_ENDPOINT=your_form_endpoint
```

2. Access in code:

```js
const apiKey = import.meta.env.VITE_API_KEY;
```

3. Set in deployment platform:
   - **Vercel**: Settings > Environment Variables
   - **Netlify**: Site settings > Build & deploy > Environment

## Continuous Deployment

### Automatic Deployment on Git Push

1. **Vercel**

   - Automatically deploys on push to main branch
   - Configure in project settings

2. **Netlify**
   - Automatic with Git integration
   - Configure branch deploys in settings

### Branch Previews

Both Vercel and Netlify create preview URLs for pull requests automatically.

## Troubleshooting

### Build Fails

- Check Node.js version (should be 16+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for missing dependencies

### Blank Page After Deployment

- Check browser console for errors
- Verify `base` path in `vite.config.js`
- Check routing configuration

### 404 on Page Refresh

- For Netlify: `_redirects` file already included
- For other hosts: Configure server to serve index.html for all routes

### Images Not Loading

- Check image paths (should be in `public/` folder)
- Verify image files are included in build
- Check network tab for 404 errors

## Post-Deployment

1. **Test Everything**

   - [ ] All navigation links work
   - [ ] Contact form submits (configure endpoint)
   - [ ] Blog posts load correctly
   - [ ] Responsive design on mobile
   - [ ] Legal pages accessible

2. **SEO Setup**

   - [ ] Submit sitemap to Google Search Console
   - [ ] Submit sitemap to Bing Webmaster Tools
   - [ ] Set up Google Analytics (optional)
   - [ ] Verify meta tags with browser extension

3. **Social Media**

   - [ ] Update social media profiles with website link
   - [ ] Test social share previews
   - [ ] Add website to LinkedIn profile

4. **Monitoring**
   - [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
   - [ ] Configure error tracking (Sentry - optional)
   - [ ] Monitor performance with Google PageSpeed Insights

## Custom Domain Setup

### DNS Configuration

For most hosting providers, you'll need to set these DNS records:

**A Records** (for root domain):

```
Type: A
Name: @
Value: [hosting provider IP]
```

**CNAME Record** (for www subdomain):

```
Type: CNAME
Name: www
Value: [hosting provider domain]
```

### Popular Domain Registrars

- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://www.godaddy.com/)
- [Google Domains](https://domains.google/)
- [Cloudflare](https://www.cloudflare.com/) (also provides DNS)

## Maintenance

### Regular Updates

- Update dependencies monthly: `npm update`
- Check for security vulnerabilities: `npm audit`
- Update blog posts regularly
- Add new projects as completed

### Backups

- Code is backed up in Git repository
- Blog content should be backed up separately
- Database backups (if using dynamic content)

## Support

For deployment issues:

- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://www.netlify.com/support/)
- GitHub Pages: [docs.github.com](https://docs.github.com/en/pages)

---

**Ready to deploy?** Choose your preferred platform and follow the steps above!
