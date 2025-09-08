import { Box, Container, Heading, Text, Button, VStack, HStack, Grid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaArrowRight, FaPlay } from 'react-icons/fa'
import { Link as RouterLink } from 'react-router-dom'
import CreativeShowcase from './CreativeShowcase'

const MotionBox = motion(Box)
const MotionHeading = motion(Heading)
const MotionText = motion(Text)

export default function HeroSection() {
  return (
    <Box
      minH="90vh"
      display="flex"
      alignItems="center"
      bg="white"
      position="relative"
      overflow="hidden"
    >
      {/* Dynamic Background Pattern */}
      <Box
        position="absolute"
        top="0"
        right="0"
        w="60%"
        h="100%"
        opacity="0.03"
        style={{
          backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"%23E53E3E\"/><circle cx=\"80\" cy=\"20\" r=\"1.5\" fill=\"%233182CE\"/><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%238B4513\"/><circle cx=\"20\" cy=\"80\" r=\"1.5\" fill=\"%233182CE\"/><circle cx=\"80\" cy=\"80\" r=\"2\" fill=\"%23E53E3E\"/></svg>')",
          backgroundSize: "60px 60px"
        }}
      />
      
      {/* Geometric Shapes */}
      <Box
        position="absolute"
        top="15%"
        right="10%"
        w="120px"
        h="120px"
        border="3px solid"
        borderColor="brand.red"
        borderRadius="20px"
        opacity="0.1"
        transform="rotate(15deg)"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="5%"
        w="80px"
        h="80px"
        bg="brand.blue"
        borderRadius="full"
        opacity="0.08"
      />
      <Box
        position="absolute"
        top="60%"
        right="25%"
        w="60px"
        h="60px"
        bg="brand.brown"
        transform="rotate(45deg)"
        opacity="0.06"
      />
      
      {/* Floating Elements */}
      <Box
        position="absolute"
        top="25%"
        left="75%"
        w="4px"
        h="40px"
        bg="brand.red"
        opacity="0.2"
        transform="rotate(25deg)"
      />
      <Box
        position="absolute"
        bottom="30%"
        left="80%"
        w="4px"
        h="30px"
        bg="brand.blue"
        opacity="0.15"
        transform="rotate(-15deg)"
      />
      
      <Container maxW="7xl" zIndex={1}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} alignItems="center">
        <VStack spacing={8} align="start">
          <MotionHeading
            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
            fontFamily="heading"
            lineHeight="0.9"
            color="gray.900"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Text as="span" color="brand.brown">
              CREATIVE
            </Text>
            <Text as="span" color="brand.red" display="block">
              DESIGN
            </Text>
            <Text as="span" color="brand.blue">
              SOLUTIONS
            </Text>
          </MotionHeading>
          
          <MotionText
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.600"
            maxW="500px"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transform your brand with professional graphic design services that capture attention and drive results.
          </MotionText>
          
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <HStack spacing={{ base: 2, md: 4 }} flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/portfolio"
                size={{ base: 'md', md: 'lg' }}
                rightIcon={<FaArrowRight />}
                bg="brand.red"
                color="white"
                minW={{ base: '140px', md: 'auto' }}
                _hover={{
                  bg: 'brand.redDark',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 25px 50px -12px rgba(229, 62, 62, 0.25)'
                }}
                transition="all 0.3s ease"
              >
                View Portfolio
              </Button>
              <Button
                as={RouterLink}
                to="/contact"
                size={{ base: 'md', md: 'lg' }}
                leftIcon={<FaPlay />}
                bg="brand.blue"
                color="white"
                minW={{ base: '120px', md: 'auto' }}
                _hover={{
                  bg: 'brand.blueDark',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 25px -5px rgba(49, 130, 206, 0.1)'
                }}
                transition="all 0.3s ease"
              >
                Get Started
              </Button>
            </HStack>
          </MotionBox>
        </VStack>
        
        {/* Creative Showcase - Right Side */}
        <Box display={{ base: 'none', lg: 'block' }} position="relative" h="600px">
          <CreativeShowcase />
        </Box>
        </Grid>
      </Container>
    </Box>
  )
}