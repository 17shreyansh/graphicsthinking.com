import { Box, Spinner, VStack, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

export default function Loading({ message = 'Loading...' }) {
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <VStack spacing={4} py={20}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.red"
          size="xl"
        />
        <Text color="gray.600" fontFamily="accent">{message}</Text>
      </VStack>
    </MotionBox>
  )
}