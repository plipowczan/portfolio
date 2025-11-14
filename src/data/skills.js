import {
  FaBrain,
  FaCloud,
  FaCog,
  FaDatabase,
  FaDocker,
  FaGitAlt,
  FaPython,
  FaRobot,
  FaServer,
} from "react-icons/fa";
import {
  SiAirtable,
  SiDotnet,
  SiFastapi,
  SiGooglebigquery,
  SiOpenai,
} from "react-icons/si";

export const skillCategories = [
  {
    name: "No-Code & Automation",
    skills: [
      { name: "Make", icon: FaCog, level: 95 },
      { name: "n8n", icon: FaCog, level: 90 },
      { name: "Airtable", icon: SiAirtable, level: 95 },
      { name: "VAPI", icon: FaRobot, level: 85 },
      { name: "AION", icon: FaBrain, level: 80 },
    ],
  },
  {
    name: "AI & Machine Learning",
    skills: [
      { name: "OpenAI (GPT-4o, o1)", icon: SiOpenai, level: 90 },
      { name: "Claude (Sonnet, Haiku)", icon: FaBrain, level: 90 },
      { name: "Perplexity AI", icon: FaRobot, level: 85 },
      { name: "Qdrant", icon: FaDatabase, level: 80 },
    ],
  },
  {
    name: "Backend & Integration",
    skills: [
      { name: "Python", icon: FaPython, level: 90 },
      { name: "FastAPI", icon: SiFastapi, level: 85 },
      { name: ".NET", icon: SiDotnet, level: 85 },
      { name: "SQL Server", icon: FaServer, level: 90 },
      { name: "BigQuery", icon: SiGooglebigquery, level: 80 },
    ],
  },
  {
    name: "Tools & Platforms",
    skills: [
      { name: "Git", icon: FaGitAlt, level: 95 },
      { name: "Docker", icon: FaDocker, level: 85 },
      { name: "Azure", icon: FaCloud, level: 85 },
      { name: "Meilisearch", icon: FaDatabase, level: 75 },
    ],
  },
];

export const highlights = [
  {
    number: "17+",
    label: "Lat Doświadczenia",
  },
  {
    number: "100+",
    label: "Zrealizowanych Projektów",
  },
  {
    number: "50+",
    label: "Zadowolonych Klientów",
  },
  {
    number: "10+",
    label: "Technologii & Platform",
  },
];
