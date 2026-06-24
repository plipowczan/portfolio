import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import {
  FADE_IN_UP,
  SITE_CONFIG,
  STAGGER_CONTAINER,
} from "../../utils/constants";

const ContactForm = () => {
  const { t } = useTranslation("home");
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate a single field; returns an error string ("" when valid)
  const validateField = (name, value) => {
    const trimmed = value.trim();
    switch (name) {
      case "name":
        return trimmed ? "" : t("contact.validation.nameRequired");
      case "email":
        if (!trimmed) return t("contact.validation.emailRequired");
        return /\S+@\S+\.\S+/.test(trimmed)
          ? ""
          : t("contact.validation.emailInvalid");
      case "message":
        if (!trimmed) return t("contact.validation.messageRequired");
        return trimmed.length < 10
          ? t("contact.validation.messageMinLength")
          : "";
      default:
        return "";
    }
  };

  // Validate on blur (not on keystroke) so users aren't nagged mid-typing
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    ["name", "email", "message"].forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Move focus to the first invalid field for keyboard/screen-reader users
      document.getElementById(Object.keys(validationErrors)[0])?.focus();
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
          subject: formData.subject || t("contact.defaultSubject"),
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
              {t("contact.title")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full mb-6" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t("contact.description")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div variants={FADE_IN_UP} className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  {t("contact.formTitle")}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  {t("contact.formDescription")}
                </p>
                <ul className="text-gray-400 leading-relaxed space-y-2 mb-6">
                  <li>• {t("contact.bullet1")}</li>
                  <li>• {t("contact.bullet2")}</li>
                  <li>• {t("contact.bullet3")}</li>
                  <li>• {t("contact.bullet4")}</li>
                </ul>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                  <FaEnvelope className="text-primary-500 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{t("contact.emailLabel")}</p>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="link">
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <p className="text-gray-400 mb-4">{t("contact.findMe")}</p>
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
                    {t("contact.nameLabel")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-required="true"
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`w-full px-4 py-3 bg-dark-700 border ${
                      errors.name ? "border-red-500" : "border-primary-500/20"
                    } rounded-lg text-white focus:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors`}
                    placeholder={t("contact.namePlaceholder")}
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    {t("contact.emailFieldLabel")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-required="true"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full px-4 py-3 bg-dark-700 border ${
                      errors.email ? "border-red-500" : "border-primary-500/20"
                    } rounded-lg text-white focus:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors`}
                    placeholder={t("contact.emailPlaceholder")}
                  />
                  {errors.email && (
                    <p id="email-error" role="alert" className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    {t("contact.subjectLabel")}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-primary-500/20 rounded-lg text-white focus:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
                    placeholder={t("contact.subjectPlaceholder")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    {t("contact.messageLabel")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows="5"
                    required
                    aria-required="true"
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`w-full px-4 py-3 bg-dark-700 border ${
                      errors.message
                        ? "border-red-500"
                        : "border-primary-500/20"
                    } rounded-lg text-white focus:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors resize-none`}
                    placeholder={t("contact.messagePlaceholder")}
                  />
                  {errors.message && (
                    <p id="message-error" role="alert" className="mt-1 text-sm text-red-500">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t("contact.submitting") : t("contact.submit")}
                </button>

                {submitStatus === "success" && (
                  <div className="success" role="alert">
                    <p className="text-primary-500 text-center">
                      {t("contact.success")}
                    </p>
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="error" role="alert">
                    <p className="text-red-500 text-center">
                      {t("contact.error", { email: SITE_CONFIG.email })}
                    </p>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
