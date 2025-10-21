import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FADE_IN_UP } from '../utils/constants'
import { SITE_CONFIG } from '../utils/constants'

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | {SITE_CONFIG.name}</title>
        <meta name="description" content="Terms of Service and usage guidelines" />
      </Helmet>

      <div className="min-h-screen py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={FADE_IN_UP}
            className="space-y-8"
          >
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                Regulamin Serwisu
              </h1>
              <p className="text-gray-400">Terms of Service</p>
              <p className="text-sm text-gray-500">
                Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}
              </p>
            </div>

            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Postanowienia ogólne</h2>
                <p className="leading-relaxed mb-4">
                  Niniejszy Regulamin określa zasady korzystania ze strony internetowej {SITE_CONFIG.url}, 
                  zwanej dalej "Serwisem". Administratorem Serwisu jest Pawel Lipowczan.
                </p>
                <p className="leading-relaxed">
                  Korzystanie z Serwisu oznacza akceptację postanowień niniejszego Regulaminu.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Definicje</h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Serwis</strong> - strona internetowa dostępna pod adresem {SITE_CONFIG.url}</li>
                  <li><strong>Administrator</strong> - Pawel Lipowczan, właściciel i operator Serwisu</li>
                  <li><strong>Użytkownik</strong> - każda osoba korzystająca z Serwisu</li>
                  <li><strong>Treść</strong> - wszelkie materiały publikowane w Serwisie (teksty, grafiki, kod)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Warunki korzystania</h2>
                <p className="leading-relaxed mb-4">Użytkownik zobowiązuje się do:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Korzystania z Serwisu zgodnie z obowiązującymi przepisami prawa</li>
                  <li>Niepodejmowania działań zakłócających działanie Serwisu</li>
                  <li>Nieużywania Serwisu w sposób sprzeczny z jego przeznaczeniem</li>
                  <li>Poszanowania praw autorskich i innych praw własności intelektualnej</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Prawa autorskie</h2>
                <p className="leading-relaxed mb-4">
                  Wszelkie treści publikowane w Serwisie, w tym teksty, grafiki, logo, kod źródłowy, 
                  są chronione prawem autorskim i stanowią własność Administratora lub są używane za zgodą ich właścicieli.
                </p>
                <p className="leading-relaxed">
                  Zabronione jest kopiowanie, modyfikowanie, rozpowszechnianie lub wykorzystywanie treści 
                  bez uprzedniej pisemnej zgody Administratora.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Wyłączenie odpowiedzialności</h2>
                <p className="leading-relaxed mb-4">
                  Administrator dokłada wszelkich starań, aby informacje publikowane w Serwisie były aktualne 
                  i poprawne, jednak nie ponosi odpowiedzialności za:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Ewentualne błędy lub niedokładności w treściach</li>
                  <li>Szkody wynikłe z korzystania lub niemożności korzystania z Serwisu</li>
                  <li>Przerwy w dostępności Serwisu wynikające z przyczyn technicznych</li>
                  <li>Treści dostępne w linkach zewnętrznych</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Linki zewnętrzne</h2>
                <p className="leading-relaxed">
                  Serwis może zawierać linki do stron internetowych osób trzecich. Administrator nie ponosi 
                  odpowiedzialności za treść, politykę prywatności ani praktyki innych stron internetowych.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Formularz kontaktowy</h2>
                <p className="leading-relaxed">
                  Użytkownik korzystający z formularza kontaktowego zobowiązuje się do podania prawdziwych 
                  i aktualnych danych kontaktowych. Administrator zastrzega sobie prawo do nieudzielenia 
                  odpowiedzi na wiadomości zawierające treści obraźliwe, spam lub niezgodne z prawem.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Zmiany w Regulaminie</h2>
                <p className="leading-relaxed">
                  Administrator zastrzega sobie prawo do wprowadzania zmian w Regulaminie. Zmiany wchodzą 
                  w życie z chwilą ich publikacji w Serwisie. Użytkownicy zostaną poinformowani o zmianach 
                  poprzez aktualizację daty ostatniej modyfikacji.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Prawo właściwe</h2>
                <p className="leading-relaxed">
                  Niniejszy Regulamin podlega prawu polskiemu. W sprawach nieuregulowanych niniejszym 
                  Regulaminem mają zastosowanie przepisy prawa polskiego.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Kontakt</h2>
                <p className="leading-relaxed">
                  W sprawach dotyczących Regulaminu lub działania Serwisu prosimy o kontakt pod adresem email: {' '}
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-primary-500 hover:text-primary-400">
                    {SITE_CONFIG.email}
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default TermsOfService

