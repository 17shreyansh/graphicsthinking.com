import { useState, useEffect } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Box, Container, Heading, Text, Image, VStack, HStack, Tag, Button,
  Avatar, Icon, SimpleGrid, Divider, Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  useColorModeValue
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { 
  FaArrowLeft, FaEye, FaHeart, FaClock, FaCalendar, FaUser, FaShare,
  FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp
} from 'react-icons/fa'
import { blogAPI } from '../services/api'
import { fallbackBlogData } from '../data/fallbackData'
import Loading from '../components/Loading'

const MotionBox = motion(Box)

const ShareButton = ({ icon, label, onClick, colorScheme }) => (
  <Button
    leftIcon={<Icon as={icon} />}
    size="sm"
    colorScheme={colorScheme}
    variant="outline"
    onClick={onClick}
  >
    {label}
  </Button>
)

export default function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  useEffect(() => {
    fetchBlogDetail()
  }, [slug])

  const fetchBlogDetail = async () => {
    setLoading(true)
    try {
      const response = await blogAPI.getById(slug)
      setPost(response.post)
      setRelated(response.related || [])
    } catch (error) {
      const fallbackItem = fallbackBlogData.find(item => item._id === slug)
      if (fallbackItem) {
        setPost({
          ...fallbackItem,
          category: 'Design Tips',
          views: 245,
          likes: 18,
          featured: true
        })
        setRelated(fallbackBlogData.filter(item => item._id !== slug).slice(0, 3))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (liked) return
    
    try {
      const response = await blogAPI.like?.(post._id)
      setPost(prev => ({ ...prev, likes: response?.likes || (prev.likes + 1) }))
      setLiked(true)
    } catch (error) {
      setPost(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }))
      setLiked(true)
    }
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const title = post.title
    const text = post.excerpt
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  if (loading) return <Loading message="Loading blog post..." />
  if (!post) {
    return (
      <Box p={20} textAlign="center">
        <Text fontSize="xl" color="gray.600">Blog post not found</Text>
        <Button as={RouterLink} to="/blog" mt={4} colorScheme="red">
          Back to Blog
        </Button>
      </Box>
    )
  }

  return (
    <Box py={10}>
      <Container maxW="4xl">
        <VStack spacing={8} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/blog">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{post.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Back Button */}
          <Button
            as={RouterLink}
            to="/blog"
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            alignSelf="flex-start"
            color="brand.red"
          >
            Back to Blog
          </Button>

          {/* Article Header */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={6} align="stretch">
              {/* Category and Featured Badge */}
              <HStack>
                <Tag colorScheme="red" size="lg">{post.category}</Tag>
                {post.featured && (
                  <Tag colorScheme="yellow" size="lg">Featured</Tag>
                )}
              </HStack>

              {/* Title */}
              <Heading 
                fontSize={{ base: '2xl', md: '4xl' }} 
                fontFamily="heading" 
                lineHeight="1.2"
                color="gray.800"
              >
                {post.title}
              </Heading>

              {/* Excerpt */}
              <Text fontSize="xl" color={textColor} lineHeight="1.6">
                {post.excerpt}
              </Text>

              {/* Meta Information */}
              <HStack spacing={6} flexWrap="wrap">
                <HStack>
                  <Avatar size="sm" name={post.author} />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="600">{post.author}</Text>
                    <Text fontSize="xs" color={textColor}>Author</Text>
                  </VStack>
                </HStack>

                <HStack>
                  <Icon as={FaCalendar} color="brand.blue" />
                  <Text fontSize="sm" color={textColor}>
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </HStack>

                <HStack>
                  <Icon as={FaClock} color="brand.brown" />
                  <Text fontSize="sm" color={textColor}>
                    {post.readTime} min read
                  </Text>
                </HStack>

                <HStack>
                  <Icon as={FaEye} color="brand.red" />
                  <Text fontSize="sm" color={textColor}>
                    {post.views} views
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </MotionBox>

          {/* Featured Image */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src={post.image}
              alt={post.title}
              w="100%"
              h={{ base: "300px", md: "500px" }}
              objectFit="cover"
              borderRadius="xl"
              boxShadow="2xl"
            />
          </MotionBox>

          {/* Article Content */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Box
              bg={bgColor}
              p={8}
              borderRadius="xl"
              boxShadow="lg"
            >
              <Text
                fontSize="lg"
                lineHeight="1.8"
                color={textColor}
                whiteSpace="pre-wrap"
                sx={{
                  '& p': { mb: 4 },
                  '& h2': { fontSize: '2xl', fontWeight: 'bold', mb: 4, mt: 8, color: 'gray.800' },
                  '& h3': { fontSize: 'xl', fontWeight: 'bold', mb: 3, mt: 6, color: 'gray.800' },
                  '& ul': { pl: 6, mb: 4 },
                  '& ol': { pl: 6, mb: 4 },
                  '& li': { mb: 2 },
                  '& blockquote': { 
                    borderLeft: '4px solid',
                    borderColor: 'brand.red',
                    pl: 4,
                    py: 2,
                    fontStyle: 'italic',
                    bg: 'gray.50',
                    borderRadius: 'md'
                  }
                }}
              >
                {post.content}
              </Text>
            </Box>
          </MotionBox>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <VStack align="start" spacing={3}>
                <Text fontWeight="600" fontFamily="accent">Tags</Text>
                <HStack wrap="wrap" spacing={2}>
                  {post.tags.map((tag, index) => (
                    <Tag key={index} size="md" colorScheme="blue" variant="outline">
                      #{tag}
                    </Tag>
                  ))}
                </HStack>
              </VStack>
            </MotionBox>
          )}

          <Divider />

          {/* Engagement and Share */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <HStack justify="space-between" flexWrap="wrap" spacing={4}>
              {/* Like Button */}
              <Button
                leftIcon={<FaHeart />}
                colorScheme={liked ? "red" : "gray"}
                variant={liked ? "solid" : "outline"}
                onClick={handleLike}
                isDisabled={liked}
              >
                {liked ? "Liked" : "Like"} ({post.likes})
              </Button>

              {/* Share Buttons */}
              <HStack spacing={2} flexWrap="wrap">
                <Text fontWeight="600" fontSize="sm">Share:</Text>
                <ShareButton
                  icon={FaFacebook}
                  label="Facebook"
                  colorScheme="facebook"
                  onClick={() => handleShare('facebook')}
                />
                <ShareButton
                  icon={FaTwitter}
                  label="Twitter"
                  colorScheme="twitter"
                  onClick={() => handleShare('twitter')}
                />
                <ShareButton
                  icon={FaLinkedin}
                  label="LinkedIn"
                  colorScheme="linkedin"
                  onClick={() => handleShare('linkedin')}
                />
                <ShareButton
                  icon={FaWhatsapp}
                  label="WhatsApp"
                  colorScheme="whatsapp"
                  onClick={() => handleShare('whatsapp')}
                />
              </HStack>
            </HStack>
          </MotionBox>

          <Divider />

          {/* Related Posts */}
          {related.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <VStack spacing={8}>
                <Heading size="lg" fontFamily="accent" textAlign="center">
                  Related Articles
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  {related.map((article) => (
                    <MotionBox
                      key={article._id}
                      as={RouterLink}
                      to={`/blog/${article.slug}`}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        bg="white"
                        borderRadius="xl"
                        overflow="hidden"
                        boxShadow="lg"
                        _hover={{ boxShadow: "xl" }}
                        h="full"
                      >
                        <Image
                          src={article.image}
                          alt={article.title}
                          w="100%"
                          h="200px"
                          objectFit="cover"
                        />
                        <Box p={4}>
                          <VStack align="start" spacing={3}>
                            <HStack>
                              <Tag size="sm" colorScheme="red">
                                {article.category}
                              </Tag>
                              <Text fontSize="xs" color={textColor}>
                                {article.readTime} min read
                              </Text>
                            </HStack>
                            
                            <Heading size="sm" fontFamily="accent" noOfLines={2}>
                              {article.title}
                            </Heading>
                            
                            <Text color={textColor} fontSize="sm" noOfLines={3}>
                              {article.excerpt}
                            </Text>
                            
                            <HStack justify="space-between" w="full">
                              <Text fontSize="xs" color={textColor}>
                                {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                              </Text>
                              <HStack>
                                <Icon as={FaEye} size="xs" color="brand.red" />
                                <Text fontSize="xs" color={textColor}>
                                  {article.views}
                                </Text>
                              </HStack>
                            </HStack>
                          </VStack>
                        </Box>
                      </Box>
                    </MotionBox>
                  ))}
                </SimpleGrid>
              </VStack>
            </MotionBox>
          )}

          {/* Call to Action */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Box
              bg="brand.red"
              color="white"
              p={8}
              borderRadius="xl"
              textAlign="center"
            >
              <VStack spacing={4}>
                <Heading size="lg" fontFamily="heading">
                  Ready to Start Your Project?
                </Heading>
                <Text fontSize="lg">
                  Let's bring your creative vision to life with our professional design services.
                </Text>
                <Button
                  as={RouterLink}
                  to="/contact"
                  size="lg"
                  bg="white"
                  color="brand.red"
                  _hover={{ transform: 'translateY(-2px)' }}
                >
                  Get Started Today
                </Button>
              </VStack>
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  )
}