import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FADE_IN_UP } from '../utils/constants'
import { SITE_CONFIG } from '../utils/constants'

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | {SITE_CONFIG.name}</title>
        <meta name="description" content="Privacy Policy and GDPR compliance information" />
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
                Polityka Prywatności
              </h1>
              <p className="text-gray-400">Privacy Policy</p>
              <p className="text-sm text-gray-500">
                Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}
              </p>
            </div>

            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Wprowadzenie</h2>
                <p className="leading-relaxed">
                  Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych 
                  użytkowników strony internetowej {SITE_CONFIG.url}. Administratorem danych osobowych jest 
                  Pawel Lipowczan, z którym można skontaktować się pod adresem email: {SITE_CONFIG.email}.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Rodzaj zbieranych danych</h2>
                <p className="leading-relaxed mb-4">
                  Podczas korzystania ze strony możemy zbierać następujące dane:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Dane kontaktowe (imię, nazwisko, adres email) - podawane dobrowolnie przez formularz kontaktowy</li>
                  <li>Dane techniczne (adres IP, typ przeglądarki, system operacyjny) - zbierane automatycznie</li>
                  <li>Pliki cookies - szczegóły w Polityce Ciasteczek</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Cel przetwarzania danych</h2>
                <p className="leading-relaxed mb-4">Dane osobowe są przetwarzane w celu:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Odpowiedzi na zapytania przesłane przez formularz kontaktowy</li>
                  <li>Świadczenia usług dostępnych na stronie</li>
                  <li>Analizy ruchu na stronie i optymalizacji jej działania</li>
                  <li>Zapewnienia bezpieczeństwa i przeciwdziałania nadużyciom</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Podstawa prawna przetwarzania</h2>
                <p className="leading-relaxed">
                  Przetwarzanie danych odbywa się na podstawie:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4 mt-4">
                  <li>Zgody użytkownika (art. 6 ust. 1 lit. a RODO)</li>
                  <li>Prawnie uzasadnionego interesu administratora (art. 6 ust. 1 lit. f RODO)</li>
                  <li>Wykonania umowy (art. 6 ust. 1 lit. b RODO)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Okres przechowywania danych</h2>
                <p className="leading-relaxed">
                  Dane osobowe są przechowywane przez okres niezbędny do realizacji celów, dla których zostały zebrane, 
                  nie dłużej jednak niż przez okres wymagany przepisami prawa lub do momentu cofnięcia zgody przez użytkownika.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Prawa użytkownika (RODO)</h2>
                <p className="leading-relaxed mb-4">
                  Zgodnie z RODO, użytkownik ma prawo do:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Dostępu do swoich danych osobowych</li>
                  <li>Sprostowania (poprawiania) danych</li>
                  <li>Usunięcia danych (prawo do bycia zapomnianym)</li>
                  <li>Ograniczenia przetwarzania danych</li>
                  <li>Przenoszenia danych</li>
                  <li>Wniesienia sprzeciwu wobec przetwarzania</li>
                  <li>Cofnięcia zgody w dowolnym momencie</li>
                  <li>Wniesienia skargi do organu nadzorczego (UODO)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Udostępnianie danych osobowych</h2>
                <p className="leading-relaxed">
                  Dane osobowe mogą być udostępniane następującym podmiotom:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4 mt-4">
                  <li>Dostawcom usług hostingowych</li>
                  <li>Dostawcom usług analitycznych (np. Google Analytics)</li>
                  <li>Dostawcom usług email</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  Dane nie są przekazywane do państw trzecich poza Europejski Obszar Gospodarczy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Bezpieczeństwo danych</h2>
                <p className="leading-relaxed">
                  Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony danych osobowych 
                  przed przypadkowym lub niezgodnym z prawem zniszczeniem, utratą, modyfikacją, nieuprawnionym 
                  ujawnieniem lub dostępem.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Kontakt</h2>
                <p className="leading-relaxed">
                  W sprawach dotyczących przetwarzania danych osobowych oraz realizacji praw wynikających z RODO, 
                  prosimy o kontakt pod adresem email: {' '}
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-primary-500 hover:text-primary-400">
                    {SITE_CONFIG.email}
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Zmiany w Polityce Prywatności</h2>
                <p className="leading-relaxed">
                  Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności. 
                  O wszelkich zmianach poinformujemy poprzez aktualizację daty ostatniej modyfikacji.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default PrivacyPolicy

