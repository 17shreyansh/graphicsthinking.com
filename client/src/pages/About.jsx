import {
  Box, Container, Heading, Text, Grid, Image, VStack, HStack, Progress
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const SkillBar = ({ skill, percentage, colorScheme = 'red' }) => (
  <Box>
    <HStack justify="space-between" mb={2}>
      <Text fontWeight="600" fontFamily="accent">{skill}</Text>
      <Text fontSize="sm" color="gray.600">{percentage}%</Text>
    </HStack>
    <Progress value={percentage} colorScheme={colorScheme} borderRadius="full" size="lg" />
  </Box>
)

export default function About() {
  const skills = [
    { skill: 'Logo Design', percentage: 95, colorScheme: 'red' },
    { skill: 'Brand Identity', percentage: 90, colorScheme: 'blue' },
    { skill: 'Digital Art', percentage: 88, colorScheme: 'orange' },
    { skill: 'Print Design', percentage: 92, colorScheme: 'red' },
    { skill: 'Social Media Design', percentage: 94, colorScheme: 'blue' }
  ]

  return (
    <Box py={20} position="relative" overflow="hidden">
      {/* Background Elements */}
      <Box
        position="absolute"
        top="10%"
        right="-5%"
        w="300px"
        h="300px"
        border="2px solid"
        borderColor="brand.blue"
        borderRadius="full"
        opacity="0.03"
      />
      <Box
        position="absolute"
        bottom="20%"
        left="-5%"
        w="200px"
        h="200px"
        bg="brand.brown"
        borderRadius="20px"
        opacity="0.02"
        transform="rotate(45deg)"
      />
      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack spacing={20}>
          {/* Hero Section */}
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={16} alignItems="center">
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <VStack align="start" spacing={6}>
                <Heading fontSize="4xl" fontFamily="heading">
                  ABOUT GRAPHICS THINKING
                </Heading>
                <Text fontSize="lg" color="gray.600">
                  We are a creative design studio passionate about transforming ideas into 
                  visually stunning realities. With over 5 years of experience in the industry, 
                  we've helped hundreds of businesses establish their visual identity and 
                  communicate their message effectively.
                </Text>
                <Text color="gray.600">
                  Our approach combines strategic thinking with creative execution, ensuring 
                  that every design not only looks beautiful but also serves its intended purpose. 
                  We believe that great design has the power to inspire, influence, and drive results.
                </Text>
              </VStack>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/about-image.jpg"
                alt="About Graphics Thinking"
                borderRadius="2xl"
                boxShadow="2xl"
              />
            </MotionBox>
          </Grid>

          {/* Skills Section */}
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={16}>
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <VStack align="start" spacing={6}>
                <Heading size="xl" fontFamily="heading">OUR EXPERTISE</Heading>
                <Text color="gray.600">
                  We specialize in various aspects of graphic design, bringing expertise 
                  and creativity to every project we undertake.
                </Text>
                <VStack spacing={4} w="full">
                  {skills.map((item, index) => (
                    <MotionBox
                      key={item.skill}
                      w="full"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <SkillBar skill={item.skill} percentage={item.percentage} colorScheme={item.colorScheme} />
                    </MotionBox>
                  ))}
                </VStack>
              </VStack>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <VStack align="start" spacing={6}>
                <Heading size="xl" fontFamily="heading">OUR PHILOSOPHY</Heading>
                <Text color="gray.600">
                  "Design is not just what it looks like and feels like. Design is how it works." 
                  - Steve Jobs
                </Text>
                <Text color="gray.600">
                  We believe in the power of thoughtful design. Every project begins with 
                  understanding your goals, your audience, and your message. We then craft 
                  visual solutions that not only capture attention but also drive action.
                </Text>
                <VStack align="start" spacing={3}>
                  <Text fontWeight="600" color="brand.red">✓ Strategic Design Approach</Text>
                  <Text fontWeight="600" color="brand.blue">✓ Client-Centered Process</Text>
                  <Text fontWeight="600" color="brand.brown">✓ Quality & Attention to Detail</Text>
                  <Text fontWeight="600" color="brand.red">✓ Timely Project Delivery</Text>
                </VStack>
              </VStack>
            </MotionBox>
          </Grid>

          {/* Stats Section */}
          <MotionBox
            bg="gray.50"
            p={12}
            borderRadius="2xl"
            w="full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={8} textAlign="center">
              <VStack>
                <Heading fontSize="4xl" color="brand.red" fontFamily="heading">500+</Heading>
                <Text fontWeight="600" fontFamily="accent">Projects Completed</Text>
              </VStack>
              <VStack>
                <Heading fontSize="4xl" color="brand.blue" fontFamily="heading">200+</Heading>
                <Text fontWeight="600" fontFamily="accent">Happy Clients</Text>
              </VStack>
              <VStack>
                <Heading fontSize="4xl" color="brand.brown" fontFamily="heading">5+</Heading>
                <Text fontWeight="600" fontFamily="accent">Years Experience</Text>
              </VStack>
              <VStack>
                <Heading fontSize="4xl" color="brand.red" fontFamily="heading">24h</Heading>
                <Text fontWeight="600" fontFamily="accent">Average Response</Text>
              </VStack>
            </Grid>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  )
}