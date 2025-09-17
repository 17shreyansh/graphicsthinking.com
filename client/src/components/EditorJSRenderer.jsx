import { Box, Heading, Text, Image, Code, UnorderedList, OrderedList, ListItem } from '@chakra-ui/react'

const EditorJSRenderer = ({ data }) => {
  if (!data || !data.blocks) {
    return <Text>No content available</Text>
  }

  const renderBlock = (block) => {
    switch (block.type) {
      case 'header':
        const level = block.data.level || 2
        return (
          <Heading 
            key={block.id} 
            as={`h${level}`} 
            size={level === 1 ? 'xl' : level === 2 ? 'lg' : level === 3 ? 'md' : 'sm'}
            mb={4}
            fontFamily="heading"
          >
            {block.data.text}
          </Heading>
        )

      case 'paragraph':
        return (
          <Text key={block.id} mb={4} lineHeight="1.8">
            {block.data.text}
          </Text>
        )

      case 'list':
        const ListComponent = block.data.style === 'ordered' ? OrderedList : UnorderedList
        return (
          <ListComponent key={block.id} mb={4} spacing={2}>
            {block.data.items.map((item, index) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </ListComponent>
        )

      case 'image':
        return (
          <Box key={block.id} mb={4} textAlign="center">
            <Image 
              src={block.data.file.url} 
              alt={block.data.caption || 'Blog image'}
              maxW="100%"
              borderRadius="md"
              shadow="md"
            />
            {block.data.caption && (
              <Text fontSize="sm" color="gray.600" mt={2} fontStyle="italic">
                {block.data.caption}
              </Text>
            )}
          </Box>
        )

      case 'quote':
        return (
          <Box 
            key={block.id} 
            borderLeft="4px solid"
            borderColor="brand.red"
            pl={4}
            py={2}
            mb={4}
            bg="gray.50"
            borderRadius="md"
          >
            <Text fontSize="lg" fontStyle="italic" mb={2}>
              "{block.data.text}"
            </Text>
            {block.data.caption && (
              <Text fontSize="sm" color="gray.600" fontWeight="bold">
                — {block.data.caption}
              </Text>
            )}
          </Box>
        )

      case 'code':
        return (
          <Code 
            key={block.id} 
            display="block" 
            whiteSpace="pre-wrap" 
            p={4} 
            mb={4}
            bg="gray.100"
            borderRadius="md"
            fontSize="sm"
          >
            {block.data.code}
          </Code>
        )

      default:
        return (
          <Text key={block.id} mb={4}>
            {block.data.text || JSON.stringify(block.data)}
          </Text>
        )
    }
  }

  return (
    <Box>
      {data.blocks.map(renderBlock)}
    </Box>
  )
}

export default EditorJSRenderer