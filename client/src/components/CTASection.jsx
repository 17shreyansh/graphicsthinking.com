import { Box, Container, VStack, Heading, Text, Button, HStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaArrowRight, FaPhone } from 'react-icons/fa'
import { Link as RouterLink } from 'react-router-dom'

const MotionBox = motion(Box)

export default function CTASection() {
  return (
    <MotionBox
      bg="brand.red"
      color="white"
      py={20}
      position="relative"
      overflow="hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Elements */}
      <Box
        position="absolute"
        top="-50px"
        right="-50px"
        w="200px"
        h="200px"
        bg="brand.blue"
        borderRadius="full"
        opacity="0.1"
      />
      <Box
        position="absolute"
        bottom="-30px"
        left="-30px"
        w="150px"
        h="150px"
        bg="brand.brown"
        borderRadius="full"
        opacity="0.1"
      />
      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack spacing={8} textAlign="center">
          <Heading fontSize={{ base: '3xl', md: '4xl' }} fontFamily="heading">
            READY TO START YOUR PROJECT?
          </Heading>
          
          <Text fontSize="lg" maxW="600px" opacity={0.9}>
            Let's discuss your design needs and create something amazing together. 
            Get in touch for a free consultation.
          </Text>
          
          <HStack spacing={{ base: 2, md: 4 }} flexWrap="wrap" justify="center">
            <Button
              as={RouterLink}
              to="/contact"
              size={{ base: 'md', md: 'lg' }}
              bg="white"
              color="brand.red"
              rightIcon={<FaArrowRight />}
              minW={{ base: '160px', md: 'auto' }}
              _hover={{
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
            >
              Start Your Project
            </Button>
            
            <Button
              as="a"
              href="tel:+15551234567"
              variant="outline"
              size={{ base: 'md', md: 'lg' }}
              borderColor="white"
              color="white"
              leftIcon={<FaPhone />}
              minW={{ base: '120px', md: 'auto' }}
              _hover={{
                bg: 'white',
                color: 'brand.red',
                transform: 'translateY(-3px)'
              }}
            >
              Call Now
            </Button>
          </HStack>
        </VStack>
      </Container>
    </MotionBox>
  )
}