import { Box, Container, Heading, Text, VStack, HStack, Avatar, Grid, Spinner } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'
import { testimonialsAPI } from '../services/api'

const MotionBox = motion(Box)

const TestimonialCard = ({ testimonial, colorScheme = 'red' }) => {
  const colors = {
    red: { star: '#E53E3E', border: 'brand.red' },
    blue: { star: '#3182CE', border: 'brand.blue' },
    brown: { star: '#8B4513', border: 'brand.brown' }
  }
  
  return (
    <MotionBox
      bg="white"
      p={8}
      borderRadius="xl"
      boxShadow="lg"
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
      border="2px solid"
      borderColor={colors[colorScheme].border}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="4px"
        bg={colors[colorScheme].border}
      />
      <VStack spacing={4} align="start">
        <HStack>
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} color={colors[colorScheme].star} />
          ))}
        </HStack>
        <Text color="gray.600" fontStyle="italic" lineHeight="1.6">"{testimonial.content}"</Text>
        <HStack>
          <Avatar size="sm" name={testimonial.name} />
          <VStack align="start" spacing={0}>
            <Text fontWeight="600" fontSize="sm">{testimonial.name}</Text>
            <Text fontSize="xs" color="gray.500">{testimonial.company}</Text>
          </VStack>
        </HStack>
      </VStack>
    </MotionBox>
  )
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonialsAPI.getAll()
        setTestimonials(response.testimonials || response || [])
      } catch (error) {
        console.error('Failed to fetch testimonials:', error)
        setTestimonials([])
      }
      setLoading(false)
    }

    fetchTestimonials()
  }, [])

  if (loading) {
    return (
      <Box bg="gray.50" py={20}>
        <Container maxW="7xl">
          <VStack spacing={8}>
            <Heading fontSize="4xl" fontFamily="heading">
              CLIENT TESTIMONIALS
            </Heading>
            <Spinner size="xl" color="brand.red" />
          </VStack>
        </Container>
      </Box>
    )
  }

  return (
    <Box bg="gray.50" py={20}>
      <Container maxW="7xl">
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="4xl" fontFamily="heading">
              CLIENT TESTIMONIALS
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="600px">
              Don't just take our word for it. Here's what our clients say about working with us.
            </Text>
          </VStack>

          {testimonials.length > 0 ? (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
              {testimonials.map((testimonial, index) => {
                const colors = ['red', 'blue', 'brown']
                return (
                  <MotionBox
                    key={testimonial._id || index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <TestimonialCard testimonial={testimonial} colorScheme={colors[index]} />
                  </MotionBox>
                )
              })}
            </Grid>
          ) : (
            <Text color="gray.600" textAlign="center">
              No testimonials available at the moment.
            </Text>
          )}
        </VStack>
      </Container>
    </Box>
  )
}