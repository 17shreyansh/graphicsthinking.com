import { Box, Container, SimpleGrid, VStack, Heading, Text } from '@chakra-ui/react'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const MotionBox = motion(Box)

const CounterItem = ({ end, label, suffix = '', color = 'brand.red' }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2000
      const increment = end / (duration / 16)
      
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      
      return () => clearInterval(timer)
    }
  }, [isInView, end])

  return (
    <VStack ref={ref} spacing={3}>
      <Heading fontSize="4xl" color={color} fontFamily="heading">
        {count}{suffix}
      </Heading>
      <Text fontWeight="600" fontFamily="accent" textAlign="center" color="gray.700">
        {label}
      </Text>
    </VStack>
  )
}

export default function StatsCounter() {
  const stats = [
    { end: 500, label: 'Projects Completed', suffix: '+', color: 'brand.red' },
    { end: 200, label: 'Happy Clients', suffix: '+', color: 'brand.blue' },
    { end: 5, label: 'Years Experience', suffix: '+', color: 'brand.brown' },
    { end: 24, label: 'Hour Support', suffix: 'h', color: 'brand.red' }
  ]

  return (
    <MotionBox
      bg="white"
      py={20}
      position="relative"
      overflow="hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        opacity="0.02"
        style={{
          backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\"><rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" fill=\"%23E53E3E\"/><rect x=\"20\" y=\"20\" width=\"20\" height=\"20\" fill=\"%233182CE\"/></svg>')",
          backgroundSize: "40px 40px"
        }}
      />
      
      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="3xl" fontFamily="heading" color="gray.800">
              OUR ACHIEVEMENTS
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Numbers that speak for our dedication and quality
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={12} w="full">
            {stats.map((stat, index) => (
              <Box
                key={index}
                bg="gray.50"
                p={8}
                borderRadius="xl"
                textAlign="center"
                border="2px solid"
                borderColor={stat.color}
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  w="100%"
                  h="4px"
                  bg={stat.color}
                />
                <CounterItem
                  end={stat.end}
                  label={stat.label}
                  suffix={stat.suffix}
                  color={stat.color}
                />
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </MotionBox>
  )
}