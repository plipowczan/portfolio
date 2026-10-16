// Site configuration
export const SITE_CONFIG = {
  name: "Pawel Lipowczan",
  email: "pawel@lipowczan.pl",
  url: "https://pawel.lipowczan.pl",
  ogImage: "/images/og-home.webp",
  schemaLogo: "/logo-schema.png",
  social: {
    github: "https://github.com/plipowczan",
    linkedin: "https://linkedin.com/in/pawellipowczan",
    twitter: "https://twitter.com/pawellipowczan",
    mastodon: "https://hachyderm.io/@pawellipowczan",
    mastodonAlt: "https://mastodon.social/@pawellipowczan",
  },
};

// Animation variants
export const FADE_IN_UP = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  },
};

export const FADE_IN = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const SCALE_IN = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  },
};

export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
