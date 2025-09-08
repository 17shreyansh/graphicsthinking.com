import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

export default function CreativeShowcase() {
  return (
    <Box position="relative" w="100%" h="100%" overflow="hidden">
      {/* Main Design Board */}
      <MotionBox
        position="absolute"
        top="15%"
        right="10%"
        w="280px"
        h="180px"
        bg="white"
        borderRadius="16px"
        boxShadow="0 20px 40px rgba(0, 0, 0, 0.1)"
        border="1px solid"
        borderColor="gray.100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        p={6}
      >
        {/* Color Swatches */}
        <Box display="flex" gap={2} mb={4}>
          <MotionBox
            w="24px"
            h="24px"
            bg="brand.red"
            borderRadius="6px"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          />
          <MotionBox
            w="24px"
            h="24px"
            bg="brand.blue"
            borderRadius="6px"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
          <MotionBox
            w="24px"
            h="24px"
            bg="brand.brown"
            borderRadius="6px"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          />
        </Box>

        {/* Typography Lines */}
        <Box mb={4}>
          <MotionBox
            w="120px"
            h="4px"
            bg="gray.800"
            borderRadius="2px"
            mb={2}
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <MotionBox
            w="80px"
            h="3px"
            bg="gray.500"
            borderRadius="2px"
            mb={2}
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 1, delay: 0.7 }}
          />
          <MotionBox
            w="100px"
            h="3px"
            bg="gray.400"
            borderRadius="2px"
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ duration: 1, delay: 0.9 }}
          />
        </Box>

        {/* Design Element */}
        <MotionBox
          position="absolute"
          bottom="20px"
          right="20px"
          w="40px"
          h="40px"
          bg="brand.red"
          borderRadius="8px"
          opacity="0.8"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </MotionBox>

      {/* Floating Icons */}
      <MotionBox
        position="absolute"
        top="25%"
        right="35%"
        w="50px"
        h="50px"
        bg="white"
        borderRadius="12px"
        boxShadow="0 8px 25px rgba(0, 0, 0, 0.08)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Box w="24px" h="24px" bg="brand.blue" borderRadius="4px" />
      </MotionBox>

      <MotionBox
        position="absolute"
        bottom="35%"
        right="20%"
        w="45px"
        h="45px"
        bg="white"
        borderRadius="50%"
        boxShadow="0 6px 20px rgba(0, 0, 0, 0.06)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        animate={{ y: [10, -15, 10] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      >
        <Box w="20px" h="20px" bg="brand.brown" borderRadius="50%" />
      </MotionBox>

      {/* Geometric Shapes */}
      <MotionBox
        position="absolute"
        top="50%"
        right="5%"
        w="60px"
        h="60px"
        border="2px solid"
        borderColor="brand.red"
        borderRadius="12px"
        opacity="0.4"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      <MotionBox
        position="absolute"
        bottom="20%"
        right="40%"
        w="30px"
        h="30px"
        bg="brand.blue"
        borderRadius="50%"
        opacity="0.6"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      />

      {/* Subtle Grid */}
      <Box
        position="absolute"
        top="0"
        right="0"
        w="100%"
        h="100%"
        opacity="0.03"
        style={{
          backgroundImage: `
            linear-gradient(rgba(229, 62, 62, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(229, 62, 62, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />
    </Box>
  )
}