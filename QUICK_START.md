# Quick Start Guide 🚀

Get your portfolio website live in under 30 minutes!

## ⚡ Fast Track to Deployment

### Step 1: Customize (15 minutes)

**1.1 Update Your Information**

Edit `src/utils/constants.js`:
```javascript
export const SITE_CONFIG = {
  name: 'Pawel Lipowczan',
  title: 'Your Tech Guide',
  email: 'your-email@example.com',        // ← Change this
  url: 'https://yoursite.com',             // ← Change this
  social: {
    github: 'https://github.com/yourusername',      // ← Change these
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://twitter.com/yourusername',
  }
}
```

**1.2 Add Your Projects**

Edit `src/data/projects.js` - Replace with your real projects or keep sample data for now.

**1.3 Update About Text**

Edit `src/components/sections/About.jsx` - Update the paragraphs with your story.

**1.4 Configure Contact Form** (Optional for now)

The form works with validation, but to receive emails:
- Sign up at [FormSpree.io](https://formspree.io/)
- Get your form endpoint
- Update Contact.jsx with the endpoint

### Step 2: Test Locally (5 minutes)

```bash
# Start dev server
npm run dev

# Open http://localhost:3000 in your browser
# Click around, test navigation, check mobile view
```

**Quick Checks:**
- [ ] Logo shows up
- [ ] Smooth scroll works
- [ ] Mobile menu works
- [ ] All sections visible
- [ ] Footer links work

### Step 3: Deploy to Vercel (5 minutes)

**Easiest Deployment Ever:**

```bash
# Install Vercel CLI (one time only)
npm install -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - What's your project's name? (press enter)
# - In which directory is your code located? (press enter)
# - Want to override the settings? N

# 🎉 Your site is now live!
```

You'll get a URL like: `https://your-project-name.vercel.app`

### Step 4: Add Custom Domain (Optional - 5 minutes)

**If you have a domain:**

1. Go to your Vercel dashboard
2. Select your project
3. Click "Settings" → "Domains"
4. Add your domain (e.g., `pawellipowczan.com`)
5. Update DNS records as shown by Vercel
6. Wait 5-10 minutes for DNS propagation

**Don't have a domain yet?**
- Buy one from [Namecheap](https://www.namecheap.com/) (~$10/year)
- Or use the free Vercel URL for now

## 🎨 Customization Checklist

### Must Do Before Launch
- [ ] Update email in `src/utils/constants.js`
- [ ] Update social media links
- [ ] Replace sample projects (or keep them for now)
- [ ] Update About section text
- [ ] Test on mobile device

### Should Do Soon After Launch
- [ ] Add real project images to `public/images/`
- [ ] Write your first blog post
- [ ] Add professional photo to About section
- [ ] Set up contact form backend (FormSpree/EmailJS)
- [ ] Update sitemap.xml with your domain
- [ ] Submit to Google Search Console

### Can Do Later
- [ ] Add more projects
- [ ] Write more blog posts
- [ ] Add testimonials
- [ ] Set up Google Analytics
- [ ] Create more detailed case studies

## 🐛 Common Issues & Quick Fixes

### "npm run dev" doesn't work
```bash
# Delete and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Build fails
```bash
# Make sure all syntax is correct
npm run build

# Check the error message and fix the file mentioned
```

### Site looks broken after deployment
- Check browser console for errors (F12)
- Verify images are in `public/` folder
- Check that all imports are correct

### Contact form doesn't send emails
- Normal! You need to set up FormSpree or EmailJS
- See `src/components/sections/Contact.jsx` for TODOs
- Form validation still works without backend

## 📱 Testing Checklist

Before launching, test these:

**Desktop**
- [ ] All menu items work
- [ ] Smooth scroll to sections
- [ ] Hover effects on cards
- [ ] Contact form validation
- [ ] Blog posts open correctly

**Mobile** (use browser DevTools or real device)
- [ ] Hamburger menu opens/closes
- [ ] All sections stack vertically
- [ ] Buttons are tap-friendly
- [ ] Text is readable
- [ ] Images don't overflow

**All Devices**
- [ ] Footer links work
- [ ] Legal pages load
- [ ] Logo links to home
- [ ] External links open in new tabs

## 🚀 Alternative Deployment Options

### Netlify (Drag & Drop)
```bash
npm run build
# Go to app.netlify.com/drop
# Drag the 'dist' folder
# Done!
```

### GitHub Pages
```bash
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

npm run build
npm run deploy
```

See **DEPLOYMENT.md** for detailed guides.

## 📚 Key Files Reference

| File | What to Update |
|------|----------------|
| `src/utils/constants.js` | Name, email, social links |
| `src/data/projects.js` | Your projects |
| `src/data/skills.js` | Your skills |
| `src/data/blogPosts.js` | Blog articles |
| `src/components/sections/About.jsx` | Personal bio |
| `src/components/sections/Contact.jsx` | Form backend config |

## 💡 Pro Tips

1. **Use the Free Vercel URL First**
   - Deploy and test before buying a domain
   - Make sure everything works

2. **Start with Sample Content**
   - Launch with placeholder projects
   - Add real content gradually

3. **Mobile First**
   - Most visitors will be on mobile
   - Test on your phone!

4. **SEO Can Wait**
   - Get the site live first
   - Optimize for search engines later

5. **Iterate**
   - Launch → Get feedback → Improve
   - Don't wait for perfection

## 🎯 Success Metrics

**Week 1:**
- [ ] Site is live
- [ ] All sections work
- [ ] Mobile responsive
- [ ] Contact form validates

**Week 2:**
- [ ] Real projects added
- [ ] First blog post published
- [ ] Contact form sends emails
- [ ] Shared on social media

**Month 1:**
- [ ] 3+ blog posts
- [ ] All projects have real images
- [ ] Google Search Console setup
- [ ] Regular updates

## 🆘 Need More Help?

Stuck? Check these resources:

1. **PROJECT_SUMMARY.md** - Complete feature list
2. **README.md** - Detailed setup guide
3. **DEPLOYMENT.md** - All deployment options
4. **.cursorrules** - Development guidelines
5. **PRD.md** - Full specifications

## 🎉 Ready to Launch?

Your portfolio is production-ready! Just:

1. ✅ Update your info (15 min)
2. ✅ Test locally (5 min)
3. ✅ Deploy to Vercel (5 min)
4. ✅ Share with the world! 🌍

**Total Time: ~25 minutes to have a live, professional portfolio!**

```bash
# Let's go!
npm run dev      # Test it
vercel           # Deploy it
                 # Share it! 🚀
```

---

**Questions?** Check the other documentation files or Google the error message - you've got this! 💪

