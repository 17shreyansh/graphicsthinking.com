import { Box } from '@chakra-ui/react'
import HeroSection from '../components/HeroSection'


import CTASection from '../components/CTASection'
import FeaturedWork from '../components/FeaturedWork'
import ServicesSection from '../components/ServicesSection'



export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Work Section */}
      <FeaturedWork />

      {/* Services Section */}
      <ServicesSection />







      {/* CTA Section */}
      <CTASection />
    </Box>
  )
}