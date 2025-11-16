import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import {
  FADE_IN_UP,
  SITE_CONFIG,
  STAGGER_CONTAINER,
} from "../../utils/constants";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Imię i nazwisko jest wymagane";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email jest wymagany";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email jest nieprawidłowy";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Wiadomość jest wymagana";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Wiadomość musi mieć co najmniej 10 znaków";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("https://formspree.io/f/xblqpqab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || "Wiadomość z formularza kontaktowego",
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: FaGithub, href: SITE_CONFIG.social.github, label: "GitHub" },
    { icon: FaLinkedin, href: SITE_CONFIG.social.linkedin, label: "LinkedIn" },
    { icon: FaTwitter, href: SITE_CONFIG.social.twitter, label: "Twitter" },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 bg-dark-800/50">
      <div className="section-container">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          {/* Section Title */}
          <motion.div variants={FADE_IN_UP} className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Skontaktuj się
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full mb-6" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Masz projekt do zrealizowania? Potrzebujesz automatyzacji? Umów
              bezpłatną konsultację!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div variants={FADE_IN_UP} className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Bezpłatna Konsultacja
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Umów się na 30-minutową bezpłatną konsultację, podczas której:
                </p>
                <ul className="text-gray-400 leading-relaxed space-y-2 mb-6">
                  <li>• Przeanalizujemy Twoje potrzeby biznesowe</li>
                  <li>• Zaproponuję optymalne rozwiązania technologiczne</li>
                  <li>• Oszacujemy czas i koszt wdrożenia</li>
                  <li>• Odpowiem na wszystkie pytania o automatyzację</li>
                </ul>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                  <FaEnvelope className="text-primary-500 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="link">
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <p className="text-gray-400 mb-4">Znajdź mnie również:</p>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-dark-900 transition-all"
                      aria-label={social.label}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={FADE_IN_UP}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-dark-700 border ${
                      errors.name ? "border-red-500" : "border-primary-500/20"
                    } rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors`}
                    placeholder="Jan Kowalski"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-dark-700 border ${
                      errors.email ? "border-red-500" : "border-primary-500/20"
                    } rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors`}
                    placeholder="jan.kowalski@firma.pl"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Temat
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-primary-500/20 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Bezpłatna konsultacja / Projekt / Pytanie"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Wiadomość *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-3 bg-dark-700 border ${
                      errors.message
                        ? "border-red-500"
                        : "border-primary-500/20"
                    } rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors resize-none`}
                    placeholder="Opisz swój projekt lub potrzeby..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
                </button>

                {submitStatus === "success" && (
                  <p className="text-primary-500 text-center">
                    Wiadomość wysłana! Odezwę się wkrótce.
                  </p>
                )}
                {submitStatus === "error" && (
                  <p className="text-red-500 text-center">
                    Błąd wysyłania. Spróbuj ponownie lub napisz bezpośrednio na{" "}
                    {SITE_CONFIG.email}
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
