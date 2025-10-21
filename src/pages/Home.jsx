import { Helmet } from 'react-helmet-async'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Projects from '../components/sections/Projects'
import Skills from '../components/sections/Skills'
import Contact from '../components/sections/Contact'
import { SITE_CONFIG } from '../utils/constants'

const Home = () => {
  return (
    <>
      <Helmet>
        <title>{SITE_CONFIG.name} | {SITE_CONFIG.title}</title>
        <meta name="description" content={SITE_CONFIG.description} />
        <meta property="og:title" content={`${SITE_CONFIG.name} - Portfolio`} />
        <meta property="og:description" content={SITE_CONFIG.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_CONFIG.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${SITE_CONFIG.name} - Portfolio`} />
        <meta name="twitter:description" content={SITE_CONFIG.description} />
      </Helmet>

      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </>
  )
}

export default Home

