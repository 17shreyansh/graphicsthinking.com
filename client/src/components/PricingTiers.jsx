import { Box, VStack, Heading, Text, Button, List, ListItem, ListIcon, Badge } from '@chakra-ui/react'
import { FaCheck } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'

const MotionBox = motion(Box)

const PricingCard = ({ tier, isPopular = false }) => (
  <MotionBox
    bg="white"
    p={8}
    borderRadius="xl"
    boxShadow={isPopular ? 'brand-lg' : 'lg'}
    border={isPopular ? '2px solid' : '1px solid'}
    borderColor={isPopular ? 'brand.red' : 'gray.200'}
    position="relative"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
  >
    {isPopular && (
      <Badge
        position="absolute"
        top="-10px"
        left="50%"
        transform="translateX(-50%)"
        bg="brand.red"
        color="white"
        px={4}
        py={1}
        borderRadius="full"
        fontSize="sm"
      >
        MOST POPULAR
      </Badge>
    )}
    
    <VStack spacing={6} align="stretch">
      <VStack spacing={2}>
        <Heading size="lg" fontFamily="accent">{tier.name}</Heading>
        <Text color="gray.600" textAlign="center">{tier.description}</Text>
      </VStack>
      
      <VStack spacing={1}>
        <Text fontSize="4xl" fontWeight="bold" color="brand.red">
          ₹{tier.price?.toLocaleString('en-IN')}
        </Text>
        <Text color="gray.500" fontSize="sm">{tier.period}</Text>
      </VStack>
      
      <List spacing={3}>
        {tier.features.map((feature, index) => (
          <ListItem key={index} display="flex" alignItems="center">
            <ListIcon as={FaCheck} color="green.500" />
            <Text fontSize="sm">{feature}</Text>
          </ListItem>
        ))}
      </List>
      
      <Button
        as={RouterLink}
        to="/contact"
        colorScheme={isPopular ? 'red' : 'gray'}
        variant={isPopular ? 'solid' : 'outline'}
        size="lg"
        w="full"
      >
        Get Started
      </Button>
    </VStack>
  </MotionBox>
)

export default function PricingTiers() {
  const tiers = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses',
      price: 24999,
      period: 'per project',
      features: [
        'Logo Design',
        'Business Card Design',
        '2 Revisions',
        'High-res Files',
        'Email Support'
      ]
    },
    {
      name: 'Professional',
      description: 'Most popular for growing brands',
      price: 49999,
      period: 'per project',
      features: [
        'Complete Brand Identity',
        'Logo + Variations',
        'Business Stationery',
        'Social Media Kit',
        '5 Revisions',
        'Priority Support'
      ]
    },
    {
      name: 'Enterprise',
      description: 'For large-scale projects',
      price: 107999,
      period: 'per project',
      features: [
        'Full Brand Package',
        'Marketing Materials',
        'Website Graphics',
        'Print & Digital Assets',
        'Unlimited Revisions',
        '24/7 Support'
      ]
    }
  ]

  return (
    <VStack spacing={8}>
      <VStack spacing={4} textAlign="center">
        <Heading fontSize="3xl" fontFamily="heading">
          PRICING PACKAGES
        </Heading>
        <Text color="gray.600" maxW="500px">
          Choose the perfect package for your design needs
        </Text>
      </VStack>
      
      <Box w="full" maxW="1200px">
        <Box display={{ base: 'block', lg: 'grid' }} gridTemplateColumns="repeat(3, 1fr)" gap={6}>
          {tiers.map((tier, index) => (
            <PricingCard
              key={tier.name}
              tier={tier}
              isPopular={index === 1}
            />
          ))}
        </Box>
      </Box>
    </VStack>
  )
}