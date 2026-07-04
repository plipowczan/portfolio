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
 * Mail do waitlisty „LLM Wiki" - ogłoszenie startu darmowego kursu.
 *
 * Brand: context/brand/brand-design.md (motyw ciemny).
 *   tło #050810 · karta #0a0e1a · tekst #f3f4f6 · akcent #00ff9d · border #1f2937
 *   font Inter (fallback systemowy), znak </> w monospace (Fira Code / monospace).
 *
 * Dwie drogi wysyłki:
 *   1) Broadcast (dashboard Resend) → `npx react-email export` → wklej HTML z out/.
 *   2) API → resend.emails.send({ react: WaitlistLaunch(), ... }).
 *
 * Link „wypisz się": Resend w broadcastach podmienia token {{{RESEND_UNSUBSCRIBE_URL}}}.
 */

const COURSE_URL = "https://pawel.lipowczan.pl/llm-wiki/kurs";

const lessons = [
  [
    "Załóż katalog z szablonu",
    "czym jest LLM Wiki i jak postawić gotową, pustą bazę",
  ],
  ["Onboarding", "jeden wywiad konfiguruje całość"],
  ["Pierwszy ingest", "surowe źródło → gotowe noty i indeksy"],
  ["Pytania i zarządzanie", "pytasz bazę zamiast czatu - z cytowaniami"],
  ["Rozwój i publikacja", "co dalej"],
];

export default function WaitlistLaunch() {
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
        5 lekcji: postaw własny second brain dla AI. Darmowo, po polsku.
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

          <Heading style={h1}>Darmowy kurs LLM Wiki jest online</Heading>

          <Text style={p}>
            Cześć, zapisałeś się na listę wokół LLM Wiki - dzięki. Obiecałem
            odezwać się, gdy będzie co pokazać.
          </Text>

          <Text style={p}>
            Właśnie ruszył <strong style={strong}>darmowy kurs</strong>: 5
            lekcji krok po kroku, jak z gotowego szablonu postawić własny „drugi
            mózg" dla AI - bazę wiedzy, która sama się porządkuje i zasila
            Twojego agenta (bez RAG, bez embeddingów).
          </Text>

          {/* Lista lekcji */}
          <Section style={card}>
            {lessons.map(([title, desc], i) => (
              <Text key={i} style={lesson}>
                <span style={num}>{i + 1}</span>
                <strong style={lessonTitle}>{title}</strong>
                <span style={lessonDesc}> - {desc}</span>
              </Text>
            ))}
          </Section>

          {/* CTA */}
          <Section style={{ textAlign: "center", padding: "12px 0 20px" }}>
            <Button href={COURSE_URL} style={button}>
              Otwórz kurs →
            </Button>
          </Section>

          <Text style={p}>
            Wszystko darmowe, po polsku, na darmowym szablonie (repo masz w
            kursie). Płatne bundle gotowej wiedzy - do załadowania wprost do
            braina - szykuję osobno. Dam znać, gdy będą.
          </Text>

          <Text style={p}>
            Jak przejdziesz choćby pierwszą lekcję - napisz, co działa, a co
            zgrzyta. Zbieram feedback, zanim pójdę dalej.
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

/* ── style (inline, email-safe) ─────────────────────────────── */

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
