import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { FADE_IN_UP, SITE_CONFIG } from "../utils/constants";

const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | {SITE_CONFIG.name}</title>
        <meta
          name="description"
          content="Cookie Policy and usage information"
        />
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
                Polityka Ciasteczek
              </h1>
              <p className="text-gray-400">Cookie Policy</p>
              <p className="text-sm text-gray-500">
                Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
              </p>
            </div>

            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. Czym są pliki cookies?
                </h2>
                <p className="leading-relaxed">
                  Pliki cookies (ciasteczka) to małe pliki tekstowe zapisywane
                  na urządzeniu użytkownika podczas przeglądania strony
                  internetowej. Cookies pozwalają stronie rozpoznać urządzenie
                  użytkownika i dostosować zawartość do jego preferencji.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. Jakie cookies używamy?
                </h2>
                <p className="leading-relaxed mb-4">
                  Na naszej stronie wykorzystujemy następujące rodzaje plików
                  cookies:
                </p>

                <div className="space-y-4">
                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Cookies niezbędne
                    </h3>
                    <p className="text-gray-400">
                      Zapewniają podstawowe funkcje strony, takie jak
                      bezpieczeństwo, zarządzanie siecią i dostępność. Nie można
                      ich wyłączyć, ponieważ strona nie będzie działać
                      prawidłowo bez nich.
                    </p>
                  </div>

                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Cookies funkcjonalne
                    </h3>
                    <p className="text-gray-400">
                      Umożliwiają zapamiętywanie wyborów użytkownika (np.
                      preferowany język, rozmiar czcionki) w celu zapewnienia
                      bardziej spersonalizowanego doświadczenia.
                    </p>
                  </div>

                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Cookies analityczne
                    </h3>
                    <p className="text-gray-400">
                      Pomagają zrozumieć, w jaki sposób użytkownicy korzystają
                      ze strony, zbierając i raportując informacje anonimowo.
                      Pozwala to na ulepszanie funkcjonalności strony.
                    </p>
                  </div>

                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Cookies marketingowe
                    </h3>
                    <p className="text-gray-400">
                      Służą do śledzenia użytkowników na stronach internetowych
                      w celu wyświetlania reklam, które są istotne i
                      interesujące dla poszczególnych użytkowników. (Obecnie
                      nieużywane)
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. Cookies stron trzecich
                </h2>
                <p className="leading-relaxed mb-4">
                  Nasza strona może wykorzystywać cookies pochodzące od
                  zewnętrznych dostawców usług, takich jak:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    <strong>Google Analytics</strong> - analiza ruchu na stronie
                  </li>
                  <li>
                    <strong>Google Fonts</strong> - dostarczanie czcionek
                  </li>
                </ul>
                <p className="leading-relaxed mt-4">
                  Dostawcy ci mogą wykorzystywać cookies zgodnie ze swoimi
                  politykami prywatności.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. Zarządzanie cookies
                </h2>
                <p className="leading-relaxed mb-4">
                  Użytkownik może kontrolować i zarządzać plikami cookies na
                  różne sposoby:
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      Ustawienia przeglądarki
                    </h3>
                    <p className="text-gray-400 mb-2">
                      Większość przeglądarek automatycznie akceptuje cookies,
                      ale można zmienić te ustawienia:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-4 text-gray-400">
                      <li>
                        Chrome: Settings &gt; Privacy and security &gt; Cookies
                      </li>
                      <li>
                        Firefox: Options &gt; Privacy & Security &gt; Cookies
                      </li>
                      <li>Safari: Preferences &gt; Privacy &gt; Cookies</li>
                      <li>Edge: Settings &gt; Privacy &gt; Cookies</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      Usuwanie cookies
                    </h3>
                    <p className="text-gray-400">
                      Można w każdej chwili usunąć pliki cookies zapisane na
                      urządzeniu poprzez ustawienia przeglądarki. Pamiętaj
                      jednak, że usunięcie cookies może wpłynąć na
                      funkcjonalność strony.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. Zgoda na cookies
                </h2>
                <p className="leading-relaxed">
                  Kontynuując przeglądanie naszej strony bez zmiany ustawień
                  przeglądarki, wyrażasz zgodę na wykorzystywanie plików cookies
                  zgodnie z niniejszą polityką.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. Aktualizacje polityki
                </h2>
                <p className="leading-relaxed">
                  Możemy okresowo aktualizować niniejszą Politykę Ciasteczek.
                  Wszelkie zmiany będą publikowane na tej stronie z
                  zaktualizowaną datą "Ostatnia aktualizacja".
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  7. Więcej informacji
                </h2>
                <p className="leading-relaxed mb-4">
                  Więcej informacji o plikach cookies można znaleźć na stronie:{" "}
                  <a
                    href="https://www.aboutcookies.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-400"
                  >
                    www.aboutcookies.org
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  8. Kontakt
                </h2>
                <p className="leading-relaxed">
                  W sprawach dotyczących Polityki Ciasteczek prosimy o kontakt
                  pod adresem email:{" "}
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-primary-500 hover:text-primary-400"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;
