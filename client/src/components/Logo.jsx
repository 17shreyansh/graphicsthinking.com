import { Text, HStack, Box, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionText = motion(Text)
const MotionBox = motion(Box)

export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { fontSize: 'lg', iconSize: 6 },
    md: { fontSize: '2xl', iconSize: 8 },
    lg: { fontSize: '4xl', iconSize: 12 }
  }

  return (
    <HStack spacing={3} align="center">
      <MotionBox
        position="relative"
        whileHover={{ rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          w={sizes[size].iconSize}
          h={sizes[size].iconSize}
          bg="brand.red"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="0"
            right="0"
            w="30%"
            h="30%"
            bg="brand.blue"
            borderRadius="0 lg 0 lg"
          />
          <Box
            position="absolute"
            bottom="0"
            left="0"
            w="30%"
            h="30%"
            bg="brand.brown"
            borderRadius="lg 0 lg 0"
          />
          <Text color="white" fontWeight="bold" fontSize={size === 'lg' ? 'xl' : 'md'} zIndex={1}>
            GT
          </Text>
        </Box>
      </MotionBox>
      <VStack spacing={0} align="start">
        <MotionText
          fontSize={sizes[size].fontSize}
          fontFamily="heading"
          color="#ffcccc"
          lineHeight="0.9"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          GRAPHICS
        </MotionText>
        <Text
          fontSize={size === 'lg' ? 'lg' : size === 'md' ? 'sm' : 'xs'}
          fontFamily="accent"
          color="#ffd8bd"
          fontWeight="600"
          letterSpacing="wider"
        >
          THINKING
        </Text>
      </VStack>
    </HStack>
  )
}