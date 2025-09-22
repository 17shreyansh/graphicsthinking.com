import { useState, useEffect } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Box, Container, Heading, Text, Grid, Image, VStack, HStack, Tag, Button,
  Badge, Icon, SimpleGrid, Divider, Breadcrumb, BreadcrumbItem, BreadcrumbLink
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaEye, FaHeart, FaExternalLinkAlt, FaCalendar, FaUser } from 'react-icons/fa'
import { portfolioAPI } from '../services/api'

import Loading from '../components/Loading'

const MotionBox = motion(Box)
const MotionImage = motion(Image)

export default function PortfolioDetail() {
  const { id } = useParams()
  const [portfolio, setPortfolio] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    fetchPortfolioDetail()
  }, [id])

  const fetchPortfolioDetail = async () => {
    setLoading(true)
    try {
      // Try slug first, then fallback to ID
      let response
      try {
        response = await fetch(`http://localhost:5000/api/portfolio/slug/${id}`).then(r => r.json())
      } catch {
        response = await portfolioAPI.getById(id)
      }
      setPortfolio(response.portfolio)
      setRelated(response.related || [])
    } catch (error) {
      console.error('Failed to fetch portfolio item:', error)
      setPortfolio(null)
      setRelated([])
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (liked) return
    
    try {
      const response = await portfolioAPI.like?.(id)
      setPortfolio(prev => ({ ...prev, likes: response?.likes || (prev.likes + 1) }))
      setLiked(true)
    } catch (error) {
      setPortfolio(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }))
      setLiked(true)
    }
  }

  if (loading) return <Loading message="Loading portfolio details..." />
  if (!portfolio) {
    return (
      <Box p={20} textAlign="center">
        <Text fontSize="xl" color="gray.600">Portfolio item not found</Text>
        <Button as={RouterLink} to="/portfolio" mt={4} colorScheme="red">
          Back to Portfolio
        </Button>
      </Box>
    )
  }

  return (
    <Box py={10}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/portfolio">Portfolio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{portfolio.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Back Button */}
          <Button
            as={RouterLink}
            to="/portfolio"
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            alignSelf="flex-start"
            color="brand.red"
          >
            Back to Portfolio
          </Button>

          {/* Main Content */}
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={12}>
            {/* Left Column - Images and Details */}
            <VStack spacing={8} align="stretch">
              {/* Main Image */}
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src={portfolio.image}
                  alt={portfolio.title}
                  w="100%"
                  h="500px"
                  objectFit="cover"
                  borderRadius="xl"
                  boxShadow="2xl"
                />
              </MotionBox>

              {/* Additional Images */}
              {portfolio.images && portfolio.images.length > 1 && (
                <MotionBox
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Heading size="md" mb={4} fontFamily="accent">Project Gallery</Heading>
                  <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                    {portfolio.images.slice(1).map((image, index) => (
                      <MotionImage
                        key={index}
                        src={image}
                        alt={`${portfolio.title} ${index + 2}`}
                        w="100%"
                        h="200px"
                        objectFit="cover"
                        borderRadius="lg"
                        cursor="pointer"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </SimpleGrid>
                </MotionBox>
              )}

              {/* Detailed Description */}
              {portfolio.detailedDescription && (
                <MotionBox
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Heading size="md" mb={4} fontFamily="accent">Project Details</Heading>
                  <Text color="gray.600" lineHeight="1.8" fontSize="lg">
                    {portfolio.detailedDescription}
                  </Text>
                </MotionBox>
              )}
            </VStack>

            {/* Right Column - Project Info */}
            <MotionBox
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <VStack spacing={6} align="stretch">
                {/* Title and Category */}
                <VStack align="start" spacing={3}>
                  <Tag colorScheme="red" size="lg">{portfolio.category}</Tag>
                  <Heading fontSize="3xl" fontFamily="heading" color="gray.800">
                    {portfolio.title}
                  </Heading>
                  <Text color="gray.600" fontSize="lg" lineHeight="1.6">
                    {portfolio.description}
                  </Text>
                </VStack>

                <Divider />

                {/* Project Meta */}
                <VStack align="stretch" spacing={4}>
                  {portfolio.client && (
                    <HStack>
                      <Icon as={FaUser} color="brand.blue" />
                      <Text fontWeight="600">Client:</Text>
                      <Text color="gray.600">{portfolio.client}</Text>
                    </HStack>
                  )}
                  
                  {portfolio.projectDate && (
                    <HStack>
                      <Icon as={FaCalendar} color="brand.brown" />
                      <Text fontWeight="600">Date:</Text>
                      <Text color="gray.600">
                        {new Date(portfolio.projectDate).toLocaleDateString()}
                      </Text>
                    </HStack>
                  )}

                  <HStack>
                    <Icon as={FaEye} color="brand.red" />
                    <Text fontWeight="600">Views:</Text>
                    <Text color="gray.600">{portfolio.views || 0}</Text>
                  </HStack>
                </VStack>

                <Divider />

                {/* Tags */}
                {portfolio.tags && portfolio.tags.length > 0 && (
                  <VStack align="start" spacing={3}>
                    <Text fontWeight="600" fontFamily="accent">Tags</Text>
                    <HStack wrap="wrap" spacing={2}>
                      {portfolio.tags.map((tag, index) => (
                        <Tag key={index} size="sm" colorScheme="blue" variant="outline">
                          {tag}
                        </Tag>
                      ))}
                    </HStack>
                  </VStack>
                )}

                {/* Technologies */}
                {portfolio.technologies && portfolio.technologies.length > 0 && (
                  <VStack align="start" spacing={3}>
                    <Text fontWeight="600" fontFamily="accent">Technologies</Text>
                    <HStack wrap="wrap" spacing={2}>
                      {portfolio.technologies.map((tech, index) => (
                        <Badge key={index} colorScheme="brown" variant="solid">
                          {tech}
                        </Badge>
                      ))}
                    </HStack>
                  </VStack>
                )}

                <Divider />

                {/* Action Buttons */}
                <VStack spacing={3}>
                  <Button
                    onClick={handleLike}
                    leftIcon={<FaHeart />}
                    colorScheme={liked ? "red" : "gray"}
                    variant={liked ? "solid" : "outline"}
                    w="full"
                    isDisabled={liked}
                  >
                    {liked ? "Liked" : "Like"} ({portfolio.likes || 0})
                  </Button>

                  {portfolio.projectUrl && (
                    <Button
                      as="a"
                      href={portfolio.projectUrl}
                      target="_blank"
                      leftIcon={<FaExternalLinkAlt />}
                      colorScheme="blue"
                      w="full"
                    >
                      View Live Project
                    </Button>
                  )}

                  <Button
                    as={RouterLink}
                    to="/contact"
                    colorScheme="brown"
                    w="full"
                  >
                    Start Similar Project
                  </Button>
                </VStack>
              </VStack>
            </MotionBox>
          </Grid>

          {/* Related Projects */}
          {related.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <VStack spacing={8} align="stretch">
                <Heading size="lg" fontFamily="accent" textAlign="center">
                  Related Projects
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  {related.map((item, index) => (
                    <MotionBox
                      key={item._id}
                      as={RouterLink}
                      to={`/portfolio/${item._id}`}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        bg="white"
                        borderRadius="xl"
                        overflow="hidden"
                        boxShadow="lg"
                        _hover={{ boxShadow: "xl" }}
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          w="100%"
                          h="200px"
                          objectFit="cover"
                        />
                        <Box p={4}>
                          <Tag size="sm" colorScheme="red" mb={2}>
                            {item.category}
                          </Tag>
                          <Heading size="sm" mb={2} fontFamily="accent">
                            {item.title}
                          </Heading>
                          <Text color="gray.600" fontSize="sm" noOfLines={2}>
                            {item.description}
                          </Text>
                        </Box>
                      </Box>
                    </MotionBox>
                  ))}
                </SimpleGrid>
              </VStack>
            </MotionBox>
          )}
        </VStack>
      </Container>
    </Box>
  )
}