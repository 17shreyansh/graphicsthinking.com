import { Component } from 'react'
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box textAlign="center" py={20}>
          <VStack spacing={6}>
            <Heading color="brand.red">Something went wrong</Heading>
            <Text color="gray.600">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Text>
            <Button
              colorScheme="red"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </VStack>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary