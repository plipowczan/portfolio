import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SITE_CONFIG } from "../../utils/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaGithub, href: SITE_CONFIG.social.github, label: "GitHub" },
    { icon: FaLinkedin, href: SITE_CONFIG.social.linkedin, label: "LinkedIn" },
    { icon: FaTwitter, href: SITE_CONFIG.social.twitter, label: "Twitter" },
    { icon: FaEnvelope, href: `mailto:${SITE_CONFIG.email}`, label: "Email" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Cookie Policy", href: "/cookie-policy" },
  ];

  return (
    <footer className="relative bg-dark-800 border-t-2 border-primary-500/30">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-primary-500 flex items-center justify-center">
                <span className="text-primary-500 font-mono text-base font-bold">
                  &lt;/&gt;
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pawel Lipowczan</h3>
                <p className="text-xs text-primary-500 uppercase tracking-wider">
                  Your Tech Guide
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Software Architect & Technology Advisor - agnostyczny dobór
              narzędzi do problemu, optymalizacja procesów przez automatyzację i
              AI.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                  Projects
                </a>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
            <div className="space-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-gray-400 hover:text-primary-500 transition-colors text-xs"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {currentYear} Pawel Lipowczan. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Built with <span className="text-primary-500">React</span> +{" "}
            <span className="text-primary-500">Vite</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

