import { useState } from 'react'
import { Box, Button, Image, VStack, Text, Progress, useToast } from '@chakra-ui/react'
import { FaUpload, FaTrash } from 'react-icons/fa'

export default function ImageUpload({ value, onChange, multiple = false }) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const toast = useToast()

  const handleFileUpload = async (files) => {
    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      
      if (multiple) {
        Array.from(files).forEach(file => formData.append('images', file))
      } else {
        formData.append('image', files[0])
      }

      const response = await fetch(`http://localhost:5000/api/upload/${multiple ? 'multiple' : 'single'}`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        if (multiple) {
          const urls = result.files.map(f => `http://localhost:5000${f.url}`)
          onChange(value ? [...value, ...urls] : urls)
        } else {
          onChange(`http://localhost:5000${result.url}`)
        }
        toast({ title: 'Upload successful', status: 'success' })
      } else {
        toast({ title: 'Upload failed', status: 'error' })
      }
      
      setUploading(false)
      setUploadProgress(0)
    } catch (error) {
      toast({ title: 'Upload failed', description: error.message, status: 'error' })
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const removeImage = (index) => {
    if (multiple) {
      const newImages = [...value]
      newImages.splice(index, 1)
      onChange(newImages)
    } else {
      onChange('')
    }
  }

  return (
    <VStack spacing={4} align="stretch">
      <Box
        border="2px dashed"
        borderColor="rgba(255,255,255,0.3)"
        borderRadius="md"
        p={6}
        textAlign="center"
        cursor="pointer"
        _hover={{ borderColor: 'brand.red' }}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          multiple={multiple}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        
        <VStack spacing={2}>
          <FaUpload size={24} color="gray" />
          <Text color="gray.300">
            {uploading ? 'Uploading...' : `Click to upload ${multiple ? 'images' : 'image'}`}
          </Text>
          {uploading && <Progress isIndeterminate colorScheme="red" w="100%" />}
        </VStack>
      </Box>

      {value && (
        <Box>
          {multiple ? (
            <VStack spacing={2}>
              {value.map((img, index) => (
                <Box key={index} position="relative" display="inline-block">
                  <Image src={img} maxH="100px" borderRadius="md" />
                  <Button
                    position="absolute"
                    top={1}
                    right={1}
                    size="xs"
                    colorScheme="red"
                    onClick={() => removeImage(index)}
                  >
                    <FaTrash />
                  </Button>
                </Box>
              ))}
            </VStack>
          ) : (
            <Box position="relative" display="inline-block">
              <Image src={value} maxH="200px" borderRadius="md" />
              <Button
                position="absolute"
                top={2}
                right={2}
                size="sm"
                colorScheme="red"
                onClick={() => removeImage()}
              >
                <FaTrash />
              </Button>
            </Box>
          )}
        </Box>
      )}
    </VStack>
  )
}