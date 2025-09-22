import { useState, useEffect } from 'react'
import { Box, Container, Heading, Text, Grid, VStack, Button, Spinner, Alert, AlertIcon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { portfolioAPI } from '../services/api'
import LazyImage from './LazyImage'


const MotionBox = motion(Box)

const FeaturedWorkCard = ({ item, index }) => {
  const colorSchemes = ['red', 'blue', 'brown']
  const colorScheme = colorSchemes[index % 3]
  
  const colors = {
    red: 'brand.red',
    blue: 'brand.blue', 
    brown: 'brand.brown'
  }

  return (
    <MotionBox
      as={Link}
      to={`/portfolio/${item._id}`}
      whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Box 
        bg="white" 
        borderRadius="xl" 
        overflow="hidden" 
        boxShadow="lg"
        border="2px solid"
        borderColor={colors[colorScheme]}
        position="relative"
        cursor="pointer"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="4px"
          bg={colors[colorScheme]}
          zIndex={1}
        />
        <Box w="100%" h="200px" bg="gray.100">
          <LazyImage
            src={item.image}
            alt={item.title}
            w="100%"
            h="200px"
            objectFit="cover"
            fallbackSrc={`https://via.placeholder.com/400x200/E53E3E/FFFFFF?text=${encodeURIComponent(item.category || 'Portfolio')}`}
          />
        </Box>
        <Box p={4}>
          <Text fontWeight="600" fontSize="sm" color="gray.800" noOfLines={1}>
            {item.title}
          </Text>
          <Text fontSize="xs" color="gray.500" mt={1}>
            {item.category}
          </Text>
        </Box>
      </Box>
    </MotionBox>
  )
}

export default function FeaturedWork() {
  const [portfolioItems, setPortfolioItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeaturedWork = async () => {
      setLoading(true)
      try {
        const response = await portfolioAPI.getAll({ featured: 'true', limit: 6 })
        if (response?.items?.length > 0) {
          setPortfolioItems(response.items)
        } else {
          setPortfolioItems([])
        }
      } catch (err) {
        setPortfolioItems([])
      }
      setLoading(false)
    }

    fetchFeaturedWork()
  }, [])

  if (loading) {
    return (
      <Box bg="white" py={20}>
        <Container maxW="7xl">
          <VStack spacing={8}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} fontFamily="body" fontWeight="800" textAlign="center">
              FEATURED WORK
            </Heading>
            <Spinner size="xl" color="brand.red" />
          </VStack>
        </Container>
      </Box>
    )
  }



  return (
    <Box bg="white" py={20} position="relative" overflow="hidden">
      {/* Decorative Elements */}
      <Box
        position="absolute"
        top="-50px"
        left="-50px"
        w="200px"
        h="200px"
        border="2px solid"
        borderColor="brand.red"
        borderRadius="full"
        opacity="0.05"
      />
      <Box
        position="absolute"
        bottom="-30px"
        right="-30px"
        w="150px"
        h="150px"
        bg="brand.blue"
        borderRadius="20px"
        opacity="0.03"
        transform="rotate(45deg)"
      />
      
      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading fontSize={{ base: '3xl', md: '4xl' }} fontFamily="body" fontWeight="800" color="black">
              FEATURED WORK
            </Heading>
            <Text fontSize="lg" color="black">
              Explore some of our recent creative projects
            </Text>
          </VStack>
          
          {portfolioItems.length > 0 ? (
            <>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
                {portfolioItems.map((item, index) => (
                  <FeaturedWorkCard key={item._id} item={item} index={index} />
                ))}
              </Grid>
              
              <Button
                as={Link}
                to="/portfolio"
                size="lg"
                variant="outline"
                colorScheme="red"
              >
                View All Work
              </Button>
            </>
          ) : (
            <Text color="black" textAlign="center">
              No featured work available at the moment.
            </Text>
          )}
        </VStack>
      </Container>
    </Box>
  )
}