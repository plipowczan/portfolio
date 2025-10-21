// Site configuration
export const SITE_CONFIG = {
  name: 'Pawel Lipowczan',
  title: 'Your Tech Guide',
  email: 'contact@pawellipowczan.com',
  description: 'Portfolio of Pawel Lipowczan - Full Stack Developer and Tech Guide, showcasing projects, skills, and technical blog articles.',
  url: 'https://pawellipowczan.com',
  social: {
    github: 'https://github.com/pawellipowczan',
    linkedin: 'https://linkedin.com/in/pawellipowczan',
    twitter: 'https://twitter.com/pawellipowczan',
  }
}

// Navigation links
export const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '#contact' },
]

// Animation variants
export const FADE_IN_UP = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
}

export const FADE_IN = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}

export const SCALE_IN = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
}

export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

