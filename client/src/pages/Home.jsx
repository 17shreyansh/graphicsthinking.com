import { Box, Container, Heading, Text, Grid, VStack, Icon, SimpleGrid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaPalette, FaRocket, FaUsers, FaAward, FaClock, FaHeart } from 'react-icons/fa'
import HeroSection from '../components/HeroSection'
import Testimonials from '../components/Testimonials'
import StatsCounter from '../components/StatsCounter'
import CTASection from '../components/CTASection'
import FeaturedWork from '../components/FeaturedWork'

const MotionBox = motion(Box)
const MotionContainer = motion(Container)

const FeatureCard = ({ icon, title, description, colorScheme = 'red' }) => {
  const colors = {
    red: { bg: 'brand.redLight', icon: 'brand.red', border: 'brand.red' },
    blue: { bg: 'brand.blueLight', icon: 'brand.blue', border: 'brand.blue' },
    brown: { bg: 'brand.brownLight', icon: 'brand.brown', border: 'brand.brown' }
  }

  return (
    <MotionBox
      bg="white"
      p={8}
      borderRadius="xl"
      boxShadow="lg"
      textAlign="center"
      whileHover={{ y: -12, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", scale: 1.02 }}
      transition={{ duration: 0.3 }}
      border="1px solid"
      borderColor="gray.100"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        bg={colors[colorScheme].bg}
        opacity="0.05"
      />

      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="4px"
        bg={colors[colorScheme].icon}
      />

      <Box
        position="relative"
        zIndex={2}
        mb={6}
      >
        <Box
          w="80px"
          h="80px"
          bg={colors[colorScheme].bg}
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mx="auto"
          mb={4}
        >
          <Icon as={icon} w={10} h={10} color={colors[colorScheme].icon} />
        </Box>
      </Box>

      <Box position="relative" zIndex={2}>
        <Heading size="md" mb={3} fontFamily="accent" color="gray.800">{title}</Heading>
        <Text color="gray.600" fontSize="sm" lineHeight="1.6">{description}</Text>
      </Box>
    </MotionBox>
  )
}

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Work Section */}
      <FeaturedWork />


      {/* Stats Section */}
      <StatsCounter />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Features Section */}
      <Box py={20} bg="gray.50" position="relative" overflow="hidden">
        {/* Background Pattern */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          opacity="0.02"
          style={{
            backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\"><rect x=\"0\" y=\"0\" width=\"100\" height=\"100\" fill=\"%23E53E3E\"/><rect x=\"100\" y=\"100\" width=\"100\" height=\"100\" fill=\"%233182CE\"/><rect x=\"100\" y=\"0\" width=\"100\" height=\"100\" fill=\"%238B4513\"/><rect x=\"0\" y=\"100\" width=\"100\" height=\"100\" fill=\"%23E53E3E\"/></svg>')",
            backgroundSize: "100px 100px"
          }}
        />
        <Container maxW="7xl" position="relative" zIndex={1}>
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading fontSize={{ base: '3xl', md: '4xl' }} fontFamily="heading">
                WHY CHOOSE US
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="600px">
                We combine creativity with strategy to deliver designs that drive results.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              <FeatureCard
                icon={FaPalette}
                title="Creative Excellence"
                description="Award-winning designs that capture attention and communicate effectively."
                colorScheme="red"
              />
              <FeatureCard
                icon={FaRocket}
                title="Fast Delivery"
                description="Quick turnaround times without compromising on quality."
                colorScheme="blue"
              />
              <FeatureCard
                icon={FaUsers}
                title="Client Focused"
                description="Collaborative approach ensuring your vision comes to life."
                colorScheme="brown"
              />
              <FeatureCard
                icon={FaAward}
                title="Premium Quality"
                description="Professional designs that exceed industry standards."
                colorScheme="red"
              />
              <FeatureCard
                icon={FaClock}
                title="24/7 Support"
                description="Always available to help with your design needs."
                colorScheme="blue"
              />
              <FeatureCard
                icon={FaHeart}
                title="Passion Driven"
                description="We love what we do and it shows in every project."
                colorScheme="brown"
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      {/* CTA Section */}
      <CTASection />
    </Box>
  )
}