import { motion } from "framer-motion";
import { FADE_IN_UP, STAGGER_CONTAINER } from "../../utils/constants";
import { useBooking } from "../../context/BookingContext";

const BookingCTA = () => {
  const { openBookingModal } = useBooking();

  const benefits = [
    "Analiza obecnych wyzwań i możliwości optymalizacji",
    "Propozycja najlepszych narzędzi i technologii dla Twojej firmy",
    "Oszacowanie czasu i kosztów wdrożenia",
    "Odpowiedzi na wszystkie pytania technologiczne",
  ];

  return (
    <section
      id="booking"
      className="py-24 md:py-32 bg-dark-800/50 relative overflow-hidden"
    >
      <div className="section-container relative z-10">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          {/* Section Title */}
          <motion.div variants={FADE_IN_UP} className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Umów spotkanie
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full mb-6" />
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
              Umów bezpłatną konsultację
            </h3>
          </motion.div>

          {/* Description */}
          <motion.div
            variants={FADE_IN_UP}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Oferuję 30-minutową bezpłatną konsultację online, podczas której
              wspólnie przeanalizujemy Twoje procesy biznesowe i zaproponuję
              konkretne rozwiązania. Bez zobowiązań, bez ukrytych kosztów - po
              prostu rozmowa o tym, jak technologia może pomóc Twojej firmie.
            </p>

            {/* Benefits List */}
            <ul className="text-left text-gray-400 space-y-3 max-w-xl mx-auto mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary-500 mt-1 flex-shrink-0">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={FADE_IN_UP} className="text-center space-y-4">
            <button
              onClick={openBookingModal}
              className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform"
            >
              Zarezerwuj Bezpłatną Konsultację
            </button>
            <p className="text-gray-400 text-sm">
              30 minut online · Bez zobowiązań · Całkowicie za darmo
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl transform -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl transform translate-x-1/2" />
    </section>
  );
};

export default BookingCTA;
