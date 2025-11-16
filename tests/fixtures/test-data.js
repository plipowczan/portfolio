/**
 * Test Data - dane testowe używane w testach
 */

export const testUrls = {
  home: "/",
  blog: "/blog",
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
  cookiePolicy: "/cookie-policy",
};

export const navigationLinks = [
  { text: "O mnie", href: "#about" },
  { text: "Projekty", href: "#projects" },
  { text: "Umiejętności", href: "#skills" },
  { text: "Blog", href: "/blog" },
  { text: "Kontakt", href: "#contact" },
];

export const sectionIds = {
  hero: "hero",
  about: "about",
  projects: "projects",
  skills: "skills",
  contact: "contact",
};

export const colorPalette = {
  primary: {
    main: "#00ff9d",
    dark: "#00cc7d",
  },
  secondary: {
    main: "#00b8ff",
  },
  dark: {
    darkest: "#050810",
    dark: "#0a0e1a",
    card: "#151b2b",
  },
};

export const testContactForm = {
  validData: {
    name: "Jan Kowalski",
    email: "jan.kowalski@example.com",
    message:
      "Test wiadomości z formularza kontaktowego. To jest przykładowy tekst testowy.",
  },
  invalidData: {
    emptyName: {
      name: "",
      email: "jan.kowalski@example.com",
      message: "Test message",
    },
    invalidEmail: {
      name: "Jan Kowalski",
      email: "nieprawidlowy-email",
      message: "Test message",
    },
    emptyMessage: {
      name: "Jan Kowalski",
      email: "jan.kowalski@example.com",
      message: "",
    },
  },
};

export const viewportSizes = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
  desktopLarge: { width: 2560, height: 1440 },
};

export const expectedSeoTags = {
  home: {
    title: /Pawel Lipowczan/i,
    description: /.+/,
    ogTitle: /.+/,
  },
  blog: {
    title: /Blog.*Pawel Lipowczan/i,
    description: /.+/,
  },
};
