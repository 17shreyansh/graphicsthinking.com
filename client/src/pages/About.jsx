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
    { skill: 'Social Media Post Design', percentage: 95, colorScheme: 'red' },
    { skill: 'Advertisement Design', percentage: 92, colorScheme: 'blue' },
    { skill: 'Printing Design', percentage: 90, colorScheme: 'orange' },
    { skill: 'Logo Design', percentage: 94, colorScheme: 'red' },
    { skill: 'Banner Design', percentage: 88, colorScheme: 'blue' },
    { skill: 'Website Banner Design', percentage: 91, colorScheme: 'orange' },
    { skill: 'Photo Manipulation', percentage: 89, colorScheme: 'red' },
    { skill: 'Image Editing', percentage: 93, colorScheme: 'blue' },
    { skill: 'Business Card Design', percentage: 87, colorScheme: 'orange' },
    { skill: 'Visiting Card Design', percentage: 86, colorScheme: 'red' }
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
                <Heading fontSize="4xl" fontFamily="body" fontWeight="800">
                  ABOUT GRAPHICS THINKING
                </Heading>
                <Text fontSize="lg" color="gray.300">
                  A passion for transforming ideas into compelling visuals. 
                  With over 2 years of experience, I specialize in logo design, print design, digital graphics, advertisement design, thumbnail, 
                  social media post design and web design. My design philosophy is simple, attractive and unique: design should not only 
                  look good but also drive results.
                </Text>
                <Text color="gray.300">
                  Design isn't just about making things look pretty—it's about creating a visual experience that tells your brand's story. 
                  I work closely with clients to understand their vision and goals, ensuring that every design is 
                  not only creative but also strategically effective.
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
                <Heading size="xl" fontFamily="body" fontWeight="800">OUR EXPERTISE</Heading>
                <Text color="gray.300">
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
                <Heading size="xl" fontFamily="body" fontWeight="800">OUR PHILOSOPHY</Heading>
                <Text color="gray.300">
                  "Design is not just what it looks like and feels like. Design is how it works." 
                  - Steve Jobs
                </Text>
                <Text color="gray.300">
                  We believe in the power of thoughtful design. Every project begins with 
                  understanding your goals, your audience, and your message. We then craft 
                  visual solutions that not only capture attention but also drive action.
                </Text>
                <VStack align="start" spacing={3}>
                  <Text fontWeight="600" color="brand.s">✓ Strategic Design Approach</Text>
                  <Text fontWeight="600" color="brand.s">✓ Client-Centered Process</Text>
                  <Text fontWeight="600" color="brand.s">✓ Quality & Attention to Detail</Text>
                  <Text fontWeight="600" color="brand.s">✓ Timely Project Delivery</Text>
                </VStack>
              </VStack>
            </MotionBox>
          </Grid>


        </VStack>
      </Container>
    </Box>
  )
}