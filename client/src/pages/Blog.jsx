import { useState, useEffect } from 'react'
import {
  Box, Container, Heading, Grid, Image, Text, VStack, Tag, Button
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
import { blogAPI } from '../services/api'


const MotionBox = motion(Box)

const BlogCard = ({ post }) => (
  <MotionBox
    as={RouterLink}
    to={`/blog/${post.slug}`}
    bg="white"
    borderRadius="xl"
    overflow="hidden"
    boxShadow="lg"
    whileHover={{ y: -10, boxShadow: "2xl" }}
    transition={{ duration: 0.3 }}
    _hover={{ textDecoration: 'none' }}
  >
    <Image
      src={post.image}
      alt={post.title}
      w="100%"
      h="200px"
      objectFit="cover"
      fallbackSrc="https://via.placeholder.com/400x200/8B4513/FFFFFF?text=Blog+Post"
    />
    <Box p={6}>
      <Tag size="sm" colorScheme="blue" mb={3}>{post.category}</Tag>
      <Heading size="md" mb={3} fontFamily="accent">{post.title}</Heading>
      <Text color="gray.600" mb={4} noOfLines={3}>{post.excerpt}</Text>
      <Text fontSize="sm" color="gray.500">
        {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
      </Text>
    </Box>
  </MotionBox>
)

export default function Blog() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await blogAPI.getAll()
      setPosts(response.posts || response || [])
    } catch (error) {
      console.error('Failed to fetch blog posts:', error)
      setPosts([])
    }
  }

  return (
    <Box py={20}>
      <Container maxW="7xl">
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="4xl" fontFamily="heading">
              DESIGN INSIGHTS
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="600px">
              Latest design trends, tips, and insights from our creative team.
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
            {Array.isArray(posts) && posts.map((post, index) => (
              <MotionBox
                key={post._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BlogCard post={post} />
              </MotionBox>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
}