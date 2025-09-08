import { Box, Text, Icon } from '@chakra-ui/react'
import { FaImage } from 'react-icons/fa'

export default function ImagePlaceholder({ width = '100%', height = '250px', text = 'Image', colorScheme = 'red' }) {
  const colors = {
    red: 'brand.red',
    blue: 'brand.blue',
    brown: 'brand.brown'
  }

  return (
    <Box
      w={width}
      h={height}
      bg="gray.100"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      borderRadius="md"
    >
      <Icon as={FaImage} w={8} h={8} color={colors[colorScheme]} mb={2} />
      <Text color="gray.500" fontSize="sm" fontWeight="500">
        {text}
      </Text>
    </Box>
  )
}