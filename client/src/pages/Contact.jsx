import { useState } from 'react'
import {
  Box, Container, Heading, Grid, VStack, HStack, Text, FormControl,
  FormLabel, Input, Textarea, Button, Icon, Link, useToast
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaBehance, FaDribbble } from 'react-icons/fa'
import axios from 'axios'

const MotionBox = motion(Box)

const ContactInfo = ({ icon, title, content, link, colorScheme = 'red' }) => {
  const colors = {
    red: 'brand.red',
    blue: 'brand.blue',
    brown: 'brand.brown'
  }
  
  return (
    <HStack spacing={4} align="start">
      <Icon as={icon} w={6} h={6} color={colors[colorScheme]} mt={1} />
      <VStack align="start" spacing={1}>
        <Text fontWeight="600" fontFamily="accent">{title}</Text>
        {link ? (
          <Link href={link} color="gray.600" _hover={{ color: colors[colorScheme] }}>
            {content}
          </Link>
        ) : (
          <Text color="gray.600">{content}</Text>
        )}
      </VStack>
    </HStack>
  )
}

const SocialLink = ({ icon, href, label }) => (
  <Link
    href={href}
    isExternal
    p={3}
    borderRadius="full"
    bg="gray.100"
    _hover={{ bg: 'brand.red', color: 'white', transform: 'translateY(-2px)' }}
    transition="all 0.3s ease"
  >
    <Icon as={icon} w={6} h={6} />
  </Link>
)

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await axios.post('/api/contact', formData)
      toast({
        title: 'Message sent successfully!',
        description: 'We\'ll get back to you within 24 hours.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast({
        title: 'Error sending message',
        description: 'Please try again or contact us directly.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box py={20}>
      <Container maxW="7xl">
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="4xl" fontFamily="heading">
              GET IN TOUCH
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="600px">
              Ready to bring your vision to life? Let's discuss your project and create something amazing together.
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={16}>
            {/* Contact Form */}
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <VStack spacing={8} align="stretch">
                <Heading size="lg" fontFamily="accent">Send us a message</Heading>
                
                <Box as="form" onSubmit={handleSubmit}>
                  <VStack spacing={6}>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} w="full">
                      <FormControl isRequired>
                        <FormLabel fontFamily="accent" fontWeight="600">Name</FormLabel>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          focusBorderColor="brand.red"
                          borderRadius="8px"
                          h="48px"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel fontFamily="accent" fontWeight="600">Email</FormLabel>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          focusBorderColor="brand.red"
                          borderRadius="8px"
                          h="48px"
                        />
                      </FormControl>
                    </Grid>
                    
                    <FormControl isRequired>
                      <FormLabel>Subject</FormLabel>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Project subject"
                        focusBorderColor="brand.red"
                      />
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Message</FormLabel>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project..."
                        rows={6}
                        focusBorderColor="brand.red"
                      />
                    </FormControl>
                    
                    <Button
                      type="submit"
                      size="lg"
                      w="full"
                      isLoading={isSubmitting}
                      loadingText="Sending..."
                    >
                      Send Message
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </MotionBox>

            {/* Contact Information */}
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <VStack spacing={8} align="stretch">
                <Heading size="lg" fontFamily="accent">Contact Information</Heading>
                
                <VStack spacing={6} align="stretch">
                  <ContactInfo
                    icon={FaEnvelope}
                    title="Email"
                    content="hello@graphicsthinking.com"
                    link="mailto:hello@graphicsthinking.com"
                    colorScheme="red"
                  />
                  <ContactInfo
                    icon={FaPhone}
                    title="Phone"
                    content="+1 (555) 123-4567"
                    link="tel:+15551234567"
                    colorScheme="blue"
                  />
                  <ContactInfo
                    icon={FaMapMarkerAlt}
                    title="Location"
                    content="New York, NY, USA"
                    colorScheme="brown"
                  />
                </VStack>

                <Box>
                  <Text fontWeight="600" fontFamily="accent" mb={4}>Follow Us</Text>
                  <HStack spacing={4}>
                    <SocialLink
                      icon={FaInstagram}
                      href="https://instagram.com/graphicsthinking"
                      label="Instagram"
                    />
                    <SocialLink
                      icon={FaBehance}
                      href="https://behance.net/graphicsthinking"
                      label="Behance"
                    />
                    <SocialLink
                      icon={FaDribbble}
                      href="https://dribbble.com/graphicsthinking"
                      label="Dribbble"
                    />
                  </HStack>
                </Box>

                <Box bg="gray.50" p={6} borderRadius="xl">
                  <Text fontWeight="600" fontFamily="accent" mb={2}>Business Hours</Text>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.600">Monday - Friday: 9:00 AM - 6:00 PM</Text>
                    <Text fontSize="sm" color="gray.600">Saturday: 10:00 AM - 4:00 PM</Text>
                    <Text fontSize="sm" color="gray.600">Sunday: Closed</Text>
                  </VStack>
                </Box>
              </VStack>
            </MotionBox>
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
}