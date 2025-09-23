import { Text, Box, Flex } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

export default function Logo({ size = 'md' }) {
  return (
    <Flex align="center" gap={3} h="fit-content" py={1}>
      <MotionBox
        w={{ base: 8, md: 10 }}
        h={{ base: 8, md: 10 }}
        bg="brand.red"
        borderRadius="md"
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        whileHover={{ rotate: 5 }}
        transition={{ duration: 0.3 }}
        flexShrink={0}
      >
        <Box
          position="absolute"
          top={0}
          right={0}
          w={2}
          h={2}
          bg="brand.blue"
          borderTopRightRadius="md"
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          w={2}
          h={2}
          bg="brand.brown"
          borderBottomLeftRadius="md"
        />
        <Text color="white" fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
          GT
        </Text>
      </MotionBox>
      
      <Flex direction="column" justify="center" align="start" h="fit-content">
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          fontFamily="heading"
          color="white"
          lineHeight="1.2"
          mb={-0.5}
        >
          GRAPHICS
        </Text>
        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          fontFamily="accent"
          color="gray.300"
          fontWeight="500"
          lineHeight="1.2"
        >
          THINKING
        </Text>
      </Flex>
    </Flex>
  )
}