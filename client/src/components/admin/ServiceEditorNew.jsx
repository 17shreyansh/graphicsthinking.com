  import { VStack, FormControl, FormLabel, Input, Textarea, Select, Switch, HStack, Button, NumberInput, NumberInputField } from '@chakra-ui/react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import ImageUpload from './ImageUpload'

export default function ServiceEditorNew({ formData, onChange }) {
  const inputStyle = {
    bg: "white",
    border: "2px solid #E2E8F0",
    color: "gray.800",
    borderRadius: "12px",
    _placeholder: { color: 'gray.500' },
    _focus: { 
      borderColor: 'brand.red', 
      boxShadow: '0 0 0 1px #E53E3E',
      bg: 'white'
    },
    _hover: { borderColor: 'gray.300' }
  }

  const addFeature = () => {
    const features = formData.features || []
    onChange('features', [...features, ''])
  }

  const updateFeature = (index, value) => {
    const features = [...(formData.features || [])]
    features[index] = value
    onChange('features', features)
  }

  const removeFeature = (index) => {
    const features = [...(formData.features || [])]
    features.splice(index, 1)
    onChange('features', features)
  }

  return (
    <VStack spacing={4}>
      <FormControl isRequired>
        <FormLabel color="gray.800" fontFamily="accent" fontWeight="600">Service Name</FormLabel>
        <Input {...inputStyle} value={formData.name || ''} onChange={(e) => onChange('name', e.target.value)} />
      </FormControl>
      
      <FormControl isRequired>
        <FormLabel color="gray.800" fontFamily="accent" fontWeight="600">Description</FormLabel>
        <Textarea {...inputStyle} rows={3} value={formData.description || ''} onChange={(e) => onChange('description', e.target.value)} />
      </FormControl>
      
      <FormControl>
        <FormLabel color="gray.800" fontFamily="accent" fontWeight="600">Detailed Description</FormLabel>
        <Textarea {...inputStyle} rows={5} value={formData.detailedDescription || ''} onChange={(e) => onChange('detailedDescription', e.target.value)} />
      </FormControl>
      
      <FormControl isRequired>
        <FormLabel color="gray.800" fontFamily="accent" fontWeight="600">Price (₹)</FormLabel>
        <NumberInput value={formData.price || ''} onChange={(value) => onChange('price', parseInt(value))}>
          <NumberInputField {...inputStyle} />
        </NumberInput>
      </FormControl>
      
      <FormControl>
        <FormLabel color="gray.800" fontFamily="accent" fontWeight="600">Original Price (₹)</FormLabel>
        <NumberInput value={formData.originalPrice || ''} onChange={(value) => onChange('originalPrice', parseInt(value))}>
          <NumberInputField {...inputStyle} />
        </NumberInput>
      </FormControl>
      
      <FormControl isRequired>
        <FormLabel color="gray.800" fontFamily="accent" fontWeight="600">Category</FormLabel>
        <Select {...inputStyle} value={formData.category || ''} onChange={(e) => onChange('category', e.target.value)}>
          <option value="">Select Category</option>
          <option value="Branding">Branding</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="Print Design">Print Design</option>
          <option value="Web Design">Web Design</option>
        </Select>
      </FormControl>
      
      <FormControl>
        <FormLabel color="gray.800" fontFamily="accent" fontWeight="600">Image</FormLabel>
        <ImageUpload 
          value={formData.image || ''} 
          onChange={(url) => onChange('image', url)} 
        />
      </FormControl>
      
      <FormControl>
        <FormLabel color="gray.800" fontFamily="accent" fontWeight="600">Delivery Time</FormLabel>
        <Input {...inputStyle} value={formData.deliveryTime || ''} onChange={(e) => onChange('deliveryTime', e.target.value)} placeholder="e.g., 5-7 days" />
      </FormControl>
      
      <FormControl>
        <FormLabel color="gray.800" fontFamily="accent" fontWeight="600">Revisions</FormLabel>
        <NumberInput value={formData.revisions || 3} onChange={(value) => onChange('revisions', parseInt(value))}>
          <NumberInputField {...inputStyle} />
        </NumberInput>
      </FormControl>
      
      <FormControl>
        <FormLabel color="gray.800" fontFamily="accent" fontWeight="600">Rating</FormLabel>
        <NumberInput min={1} max={5} step={0.1} value={formData.rating || 5} onChange={(value) => onChange('rating', parseFloat(value))}>
          <NumberInputField {...inputStyle} />
        </NumberInput>
      </FormControl>
      
      <FormControl>
        <FormLabel color="gray.800" fontFamily="accent" fontWeight="600">Features</FormLabel>
        <VStack spacing={2} align="stretch">
          {(formData.features || []).map((feature, index) => (
            <HStack key={index}>
              <Input {...inputStyle} value={feature} onChange={(e) => updateFeature(index, e.target.value)} placeholder="Enter feature" />
              <Button size="sm" colorScheme="red" onClick={() => removeFeature(index)}>
                <FaTrash />
              </Button>
            </HStack>
          ))}
          <Button size="sm" leftIcon={<FaPlus />} onClick={addFeature} variant="outline">
            Add Feature
          </Button>
        </VStack>
      </FormControl>
      
      <FormControl>
        <FormLabel color="gray.800" fontFamily="accent" fontWeight="600">Active</FormLabel>
        <Switch colorScheme="red" isChecked={formData.active !== false} onChange={(e) => onChange('active', e.target.checked)} />
      </FormControl>
      
      <FormControl>
        <FormLabel color="gray.800" fontFamily="accent" fontWeight="600">Popular</FormLabel>
        <Switch colorScheme="red" isChecked={formData.popular || false} onChange={(e) => onChange('popular', e.target.checked)} />
      </FormControl>
    </VStack>
  )
}