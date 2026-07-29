import { motion } from "framer-motion";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import GrowingNetworkBackground from "../components/animations/GrowingNetworkBackground";
import CourseAudience from "../components/sections/CourseAudience";
import CourseFaq from "../components/sections/CourseFaq";
import SEO from "../components/seo/SEO";
import { FADE_IN_UP, SITE_CONFIG, STAGGER_CONTAINER } from "../utils/constants";

const REPO_URL = "https://github.com/plipowczan/second-brain-template";
const SUBSCRIBE_ENDPOINT = "/api/subscribe";

const VALUE_INDEX = [
  {
    num: "00",
    title: "Kumuluje się sama",
    body: "Każdy ingest i dobra odpowiedź powiększają bazę. Wiedza rośnie, zamiast ginąć w czacie.",
  },
  {
    num: "01",
    title: "Index-first",
    body: "Agent czyta indeks i wchodzi tylko w trafne noty. Do ~500 źródeł bez embeddings i RAG.",
  },
  {
    num: "02",
    title: "Przenośna",
    body: "Czysty markdown zgodny ze standardem OKF. git clone - i masz całą bazę u siebie.",
  },
];

const LlmWikiLanding = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // null | "success" | "error"

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError("Podaj poprawny adres email.");
      document.getElementById("waitlist-email")?.focus();
      return;
    }

    setError("");
    setIsSubmitting(true);
    setStatus(null);

    try {
      // Honeypot value — real users leave it empty; bots that fill it are
      // dropped server-side. Read from the DOM so it also catches autofill.
      const company = document.getElementById("waitlist-company")?.value ?? "";

      const response = await fetch(SUBSCRIBE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "waitlist",
          company,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="LLM Wiki - baza wiedzy, która rośnie sama"
        description="Darmowy szablon second brain w modelu LLM Wiki (Karpathy), zgodny ze standardem OKF. Zapisz się na listę - dam znać, gdy ruszy kurs i kolejne materiały."
        path="/llm-wiki"
        // PL-only page: no `alternateUrl` and no `mirroredByPrefix`, so <SEO>
        // emits no hreflang at all. A /en/llm-wiki mirror does not exist.
      />

      <section className="relative flex min-h-screen items-center overflow-hidden py-24 md:py-32">
        <GrowingNetworkBackground />

        <div className="section-container relative z-10">
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-2xl space-y-8 rounded-xl border border-primary-500/20 bg-dark-800/50 p-6 backdrop-blur-sm md:p-10"
          >
            {/* Eyebrow — this is a living note */}
            <motion.div
              variants={FADE_IN_UP}
              className="flex items-center gap-2 font-mono text-xs text-gray-500 md:text-sm"
            >
              <span>second-brain/llm-wiki.md</span>
              <span className="text-primary-500" aria-hidden="true">
                ●
              </span>
              <span className="text-primary-500">live</span>
            </motion.div>

            {/* Hook */}
            <motion.div variants={FADE_IN_UP} className="space-y-4">
              <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                <span className="font-mono text-primary-500" aria-hidden="true">
                  #
                </span>{" "}
                <span className="gradient-text">
                  Baza wiedzy, która rośnie sama
                </span>
              </h1>
              <p className="text-base text-gray-400 md:text-lg">
                LLM Wiki (koncept Karpathy&apos;ego): zamiast za każdym razem
                przeszukiwać surowe notatki, agent przyrostowo buduje żywą bazę
                markdown - czytelną dla Ciebie i dla agenta, zgodną ze standardem
                OKF (Google).
              </p>
            </motion.div>

            {/* Signature: index.md block (the 3 value props) */}
            <motion.div variants={FADE_IN_UP} className="space-y-3">
              <p className="select-none font-mono text-xs text-gray-600">
                index.md
              </p>
              <ul className="space-y-3">
                {VALUE_INDEX.map((item) => (
                  <li key={item.num} className="flex items-baseline gap-3">
                    <span className="select-none font-mono text-sm text-gray-600">
                      {item.num}
                    </span>
                    <span
                      className="select-none font-mono text-primary-500"
                      aria-hidden="true"
                    >
                      ◍
                    </span>
                    <div>
                      <h2 className="font-mono text-base text-white">
                        <span className="text-gray-600" aria-hidden="true">
                          [[
                        </span>
                        {item.title}
                        <span className="text-gray-600" aria-hidden="true">
                          ]]
                        </span>
                      </h2>
                      <p className="text-sm leading-relaxed text-gray-400">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Audience + prerequisites — shared with the course hub */}
            <CourseAudience />

            {/* CTA + form / success screen */}
            {status === "success" ? (
              <motion.div variants={FADE_IN_UP} className="space-y-6">
                <div className="space-y-2">
                  <p role="alert" className="text-xl font-bold text-primary-500">
                    ✅ Jesteś na liście!
                  </p>
                  <p className="text-gray-400">
                    Kurs już ruszył - a o kolejnych materiałach dam znać. Skoro
                    już tu jesteś - zacznij od razu. Szablon jest darmowy i
                    publiczny.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <FaGithub size={18} />
                    Weź szablon na GitHubie →
                  </a>

                  <Link
                    to="/llm-wiki/kurs"
                    className="inline-flex items-center gap-2 font-mono text-sm text-primary-500 hover:text-primary-400"
                  >
                    → Wejdź w darmowy kurs
                  </Link>
                </div>

                <div className="space-y-3 rounded-lg border border-primary-500/20 bg-dark-700 p-5">
                  <p className="font-bold text-white">
                    Od zera do pierwszego pytania - 5 minut:
                  </p>
                  <ol className="list-inside list-decimal space-y-2 text-sm leading-relaxed text-gray-300 marker:text-primary-500">
                    <li>
                      <strong>Weź szablon</strong> - na GitHubie{" "}
                      <em>Use this template</em> (albo{" "}
                      <code className="font-mono text-primary-400">git clone</code>
                      ), otwórz folder w Claude Code.
                    </li>
                    <li>
                      <code className="font-mono text-primary-400">/onboard</code>{" "}
                      - krótki wywiad (nazwa, język, tematy, głos); struktura,
                      schema i indeksy generują się same. Jedyna konfiguracja.
                    </li>
                    <li>
                      <code className="font-mono text-primary-400">/ingest</code>{" "}
                      - wrzuć źródło do{" "}
                      <code className="font-mono text-primary-400">
                        content/_raw/inbox/
                      </code>{" "}
                      i odpal; powstaje nota + 3 indeksy się aktualizują.
                    </li>
                    <li>
                      <code className="font-mono text-primary-400">
                        /qa &quot;twoje pytanie&quot;
                      </code>{" "}
                      - odpowiedź z cytowaniami z Twojej bazy. Pytanie do bazy, nie
                      do czatu.
                    </li>
                    <li>
                      <strong>(bonus)</strong>{" "}
                      <code className="font-mono text-primary-400">/lint</code> -
                      przegląd stanu bazy: sprzeczności, sieroty, przeterminowane
                      noty.
                    </li>
                  </ol>
                </div>

                <p className="text-xs text-gray-500">
                  Pełny przewodnik + akceleratory (gotowe skille, ekstrakt realnej
                  bazy) będą w kursie. Odezwę się.
                </p>
              </motion.div>
            ) : (
              <motion.div variants={FADE_IN_UP} className="space-y-4">
                <p className="text-gray-300">
                  Zostaw maila - dostaniesz darmowy szablon i dam znać, gdy ruszy
                  kurs i kolejne materiały. Metoda, szablon i kurs są darmowe -
                  płatne będą tylko paczki gotowych, obrobionych notatek, dla
                  tych, którzy wolą zacząć z pełną półką.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 sm:flex-row"
                  noValidate
                >
                  {/* Honeypot — off-screen, hidden from users & AT. Bots that
                      fill it are silently dropped by /api/subscribe. */}
                  <div
                    className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
                    aria-hidden="true"
                  >
                    <label htmlFor="waitlist-company">
                      Nie wypełniaj tego pola
                    </label>
                    <input
                      type="text"
                      id="waitlist-company"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="waitlist-email" className="sr-only">
                      Adres email
                    </label>
                    <input
                      type="email"
                      id="waitlist-email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="twoj@email.pl"
                      aria-invalid={error ? "true" : "false"}
                      aria-describedby={
                        error ? "waitlist-email-error" : undefined
                      }
                      className={`w-full rounded-lg border bg-dark-700 px-4 py-3 font-mono text-white transition-colors placeholder:font-mono focus:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                        error ? "border-red-500" : "border-primary-500/20"
                      }`}
                    />
                    {error && (
                      <p
                        id="waitlist-email-error"
                        role="alert"
                        className="mt-1 text-sm text-red-500"
                      >
                        {error}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "Zapisuję..." : "Zapisz mnie"}
                  </button>
                </form>

                {status === "error" && (
                  <p role="alert" className="text-sm text-red-500">
                    Coś poszło nie tak. Spróbuj ponownie lub napisz na{" "}
                    {SITE_CONFIG.email}.
                  </p>
                )}

                {/*
                  Secondary, ungated way into the course. The course is public
                  and returns 200 to anyone who knows the URL, so the form was
                  not protecting it — it only hid the link, which left
                  /llm-wiki/kurs and all 8 lessons with no internal inbound
                  link at all. The signup above stays the primary call.
                */}
                <Link
                  to="/llm-wiki/kurs"
                  className="inline-flex items-center gap-2 font-mono text-sm text-gray-400 hover:text-primary-500 transition-colors"
                >
                  → albo wejdź od razu w darmowy kurs
                </Link>
              </motion.div>
            )}

            {/* RODO line — only before signup */}
            {status !== "success" && (
              <motion.p
                variants={FADE_IN_UP}
                className="text-xs text-gray-500"
              >
                Zapisując się, zgadzasz się na kontakt mailowy w sprawie szablonu
                i kursu. Szczegóły w{" "}
                <a
                  href="/privacy-policy"
                  className="text-primary-500 hover:text-primary-400"
                >
                  Polityce prywatności
                </a>
                .
              </motion.p>
            )}

            {/* Objections block — below the form by design (TLDR sits at the
                CTA above); subset of src/data/courseFaq.js, no FAQPage schema
                here (the course hub is the canonical FAQ page) and no links
                (repo/course stay gated until signup). */}
            <CourseFaq surface="landing" />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default LlmWikiLanding;
