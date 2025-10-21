import { 
  FaReact, 
  FaNodeJs, 
  FaPython, 
  FaGitAlt, 
  FaDocker,
  FaDatabase,
  FaHtml5,
  FaCss3Alt,
  FaJs
} from 'react-icons/fa'
import { 
  SiTypescript, 
  SiTailwindcss, 
  SiMongodb, 
  SiPostgresql,
  SiExpress,
  SiVite,
  SiNextdotjs,
  SiFramer,
  SiRedis,
  SiGraphql
} from 'react-icons/si'

export const skillCategories = [
  {
    name: 'Frontend Development',
    skills: [
      { name: 'React', icon: FaReact, level: 90 },
      { name: 'TypeScript', icon: SiTypescript, level: 85 },
      { name: 'JavaScript', icon: FaJs, level: 95 },
      { name: 'Next.js', icon: SiNextdotjs, level: 80 },
      { name: 'Tailwind CSS', icon: SiTailwindcss, level: 90 },
      { name: 'Framer Motion', icon: SiFramer, level: 85 },
      { name: 'HTML5', icon: FaHtml5, level: 95 },
      { name: 'CSS3', icon: FaCss3Alt, level: 90 },
    ]
  },
  {
    name: 'Backend Development',
    skills: [
      { name: 'Node.js', icon: FaNodeJs, level: 85 },
      { name: 'Express', icon: SiExpress, level: 85 },
      { name: 'Python', icon: FaPython, level: 75 },
      { name: 'GraphQL', icon: SiGraphql, level: 70 },
    ]
  },
  {
    name: 'Database & Tools',
    skills: [
      { name: 'MongoDB', icon: SiMongodb, level: 85 },
      { name: 'PostgreSQL', icon: SiPostgresql, level: 80 },
      { name: 'Redis', icon: SiRedis, level: 70 },
      { name: 'SQL', icon: FaDatabase, level: 85 },
    ]
  },
  {
    name: 'Development Tools',
    skills: [
      { name: 'Git', icon: FaGitAlt, level: 90 },
      { name: 'Docker', icon: FaDocker, level: 75 },
      { name: 'Vite', icon: SiVite, level: 85 },
    ]
  }
]

export const highlights = [
  {
    number: '5+',
    label: 'Years Experience'
  },
  {
    number: '50+',
    label: 'Projects Completed'
  },
  {
    number: '30+',
    label: 'Happy Clients'
  },
  {
    number: '100+',
    label: 'Blog Articles'
  }
]

