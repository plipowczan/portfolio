import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

/**
 * Mail do subskrybentów kursu LLM Wiki - szablon dostał pierwszą oznaczoną wersję (v0.1.0).
 *
 * Brand: context/brand/brand-design.md (motyw ciemny), style skopiowane 1:1 z WaitlistLaunch.jsx
 * (ten sam format = standard dla wszystkich maili do tej listy).
 *   tło #050810 · karta #0a0e1a · tekst #f3f4f6 · akcent #00ff9d · border #1f2937
 *   font Inter (fallback systemowy), znak </> w monospace (Fira Code / monospace).
 *
 * Dwie drogi wysyłki:
 *   1) Broadcast (dashboard Resend) → `npx react-email export` → wklej HTML z out/.
 *   2) API → resend.emails.send({ react: TemplateRelease010(), ... }).
 *
 * Link „wypisz się": Resend w broadcastach podmienia token {{{RESEND_UNSUBSCRIBE_URL}}}.
 */

const REPO_URL = "https://github.com/plipowczan/second-brain-template";
const CHANGELOG_URL =
  "https://github.com/plipowczan/second-brain-template/blob/main/CHANGELOG.md";

const changes = [
  ["/curate", "znajdzie martwe noty, duplikaty i linki donikąd, zaproponuje co zarchiwizować"],
  ["/export i /import", "przenosisz wybrane noty między dwiema bazami jako gotową paczkę"],
  [
    "Auto-odświeżanie indeksów",
    "raz w tygodniu automat sprawdzi indeksy i sam zgłosi poprawkę do zatwierdzenia jednym kliknięciem",
  ],
  ["Naprawiony polski tekst", "/lint, /gaps i /refactor potrafiły się wywalić na polskich znakach - już nie"],
  ["Licencja MIT", "możesz kopiować, modyfikować i publikować swój fork bez pytania"],
];

export default function TemplateRelease010() {
  return (
    <Html lang="pl">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily={["Helvetica", "Arial", "sans-serif"]}
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>
        v0.1.0: /curate, /export i /import, auto-odświeżanie indeksów, fix polskich znaków.
      </Preview>

      <Body style={body}>
        <Container style={container}>
          {/* Nagłówek / logo tekstowe */}
          <Section style={{ paddingBottom: "8px" }}>
            <Text style={brandMark}>
              <span style={brackets}>&lt;/&gt;</span> Paweł Lipowczan
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading style={h1}>Szablon LLM Wiki ma pierwszą wersję: v0.1.0</Heading>

          <Text style={p}>
            Cześć, szablon <strong style={strong}>second-brain-template</strong>
            (LLM Wiki, ten spod kursu) dostał dziś pierwszy oznaczony numer
            wersji: v0.1.0.
          </Text>

          <Text style={p}>Co nowego:</Text>

          {/* Lista zmian */}
          <Section style={card}>
            {changes.map(([title, desc], i) => (
              <Text key={i} style={lesson}>
                <span style={num}>{i + 1}</span>
                <strong style={lessonTitle}>{title}</strong>
                <span style={lessonDesc}> - {desc}</span>
              </Text>
            ))}
          </Section>

          {/* CTA */}
          <Section style={{ textAlign: "center", padding: "12px 0 20px" }}>
            <Button href={REPO_URL} style={button}>
              Zobacz repo →
            </Button>
          </Section>

          <Text style={p}>
            Pełna lista zmian:{" "}
            <Link href={CHANGELOG_URL} style={inlineLink}>
              CHANGELOG.md w repo
            </Link>
            .
          </Text>

          <Text style={p}>
            To formalność, nie pilny alarm. Masz już postawioną bazę,
            niezależnie kiedy ją zrobiłeś? Działa dalej normalnie. Nic się nie
            psuje, nic nie musisz robić.
          </Text>

          <Text style={p}>
            Chcesz mimo to podciągnąć nowości: wklej swojemu agentowi link do
            repo wyżej i poproś o aktualizację do najnowszej wersji szablonu.
            Forkowałeś repo na GitHubie? Dodatkowo pomoże przycisk „Sync
            fork". Kliknąłeś „Use this template"? To osobne repo bez
            automatycznego połączenia z oryginałem - agent i tak sobie
            poradzi, ściągając brakujące zmiany z CHANGELOG-a.
          </Text>

          <Text style={p}>
            Napisz, co działa, a co nie. Jeśli w ogóle nie udało się
            wystartować, powiedz co Cię zatrzymało. Czytam każdą odpowiedź.
          </Text>

          <Text style={{ ...p, marginBottom: "4px" }}>Paweł</Text>

          <Hr style={hr} />

          {/* Stopka */}
          <Text style={footer}>
            Paweł Lipowczan · PLSoft - Twój Przewodnik Technologiczny
            <br />
            <Link href="https://pawel.lipowczan.pl" style={footerLink}>
              pawel.lipowczan.pl
            </Link>
            {"  ·  "}
            <Link href={"{{{RESEND_UNSUBSCRIBE_URL}}}"} style={footerLink}>
              Wypisz się
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

/* ── style (inline, email-safe) - identyczne z WaitlistLaunch.jsx ──── */

const body = {
  backgroundColor: "#050810",
  margin: 0,
  padding: "24px 0",
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "32px",
  backgroundColor: "#0a0e1a",
  border: "1px solid #1f2937",
  borderRadius: "12px",
};

const brandMark = {
  margin: 0,
  fontSize: "16px",
  fontWeight: 700,
  color: "#f3f4f6",
  letterSpacing: "0.2px",
};

const brackets = {
  fontFamily: "'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace",
  color: "#00ff9d",
  fontWeight: 700,
};

const h1 = {
  margin: "20px 0 12px",
  fontSize: "26px",
  lineHeight: "1.25",
  fontWeight: 800,
  color: "#ffffff",
};

const p = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#f3f4f6",
};

const strong = { color: "#00ff9d", fontWeight: 700 };

const card = {
  margin: "8px 0 4px",
  padding: "12px 16px",
  backgroundColor: "#151b2b",
  border: "1px solid #1f2937",
  borderRadius: "12px",
};

const lesson = {
  margin: "8px 0",
  fontSize: "15px",
  lineHeight: "1.5",
  color: "#f3f4f6",
};

const num = {
  display: "inline-block",
  minWidth: "22px",
  color: "#00ff9d",
  fontFamily: "'Fira Code', ui-monospace, monospace",
  fontWeight: 600,
};

const lessonTitle = { color: "#ffffff", fontWeight: 600 };
const lessonDesc = { color: "rgba(243,244,246,0.7)" };

const inlineLink = { color: "#00b8ff", textDecoration: "underline" };

const button = {
  backgroundColor: "#00ff9d",
  color: "#050810",
  fontSize: "16px",
  fontWeight: 700,
  textDecoration: "none",
  padding: "14px 28px",
  borderRadius: "8px",
  display: "inline-block",
};

const hr = { borderColor: "#1f2937", margin: "20px 0" };

const footer = {
  margin: 0,
  fontSize: "12px",
  lineHeight: "1.6",
  color: "rgba(243,244,246,0.55)",
};

const footerLink = { color: "#00b8ff", textDecoration: "underline" };
