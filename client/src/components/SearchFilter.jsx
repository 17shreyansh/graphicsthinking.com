import { HStack, Input, Select, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'

export default function SearchFilter({ searchTerm, setSearchTerm, sortBy, setSortBy }) {
  return (
    <HStack spacing={4} w="full" maxW="600px">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <FaSearch color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search portfolio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          focusBorderColor="brand.red"
        />
      </InputGroup>
      
      <Select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        maxW="200px"
        focusBorderColor="brand.red"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="title">Title A-Z</option>
      </Select>
    </HStack>
  )
}