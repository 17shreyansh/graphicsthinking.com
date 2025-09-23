import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, message, Image, Popconfirm, Select, Input, Typography, Spin, Space, Tag, Modal, Tooltip } from 'antd'
import { DeleteOutlined, EyeOutlined, SearchOutlined, FolderOutlined, CopyOutlined, UploadOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { uploadService } from '../../services/uploadService'
import ImageUpload from './ImageUpload'

const { Title, Text } = Typography
const { Search } = Input

export default function ImageManager() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [searchTerm, setSearchTerm] = useState('')
  const [uploadModalVisible, setUploadModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewVisible, setPreviewVisible] = useState(false)

  const categories = [
    { value: 'general', label: 'General', color: 'blue' },
    { value: 'portfolio', label: 'Portfolio', color: 'green' },
    { value: 'services', label: 'Services', color: 'orange' }
  ]

  useEffect(() => {
    fetchImages()
  }, [selectedCategory])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const result = await uploadService.getFileList(selectedCategory)
      if (result.success) {
        setImages(result.files || [])
      } else {
        message.error('Failed to fetch images')
      }
    } catch (error) {
      console.error('Error fetching images:', error)
      message.error('Failed to fetch images')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (filename) => {
    try {
      await uploadService.deleteFile(`/uploads/${selectedCategory}/${filename}`)
      message.success('Image deleted successfully')
      fetchImages()
    } catch (error) {
      console.error('Error deleting image:', error)
      message.error('Failed to delete image')
    }
  }

  const filteredImages = images.filter(image => 
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const copyToClipboard = (url) => {
    const fullUrl = uploadService.getFileUrl(url)
    navigator.clipboard.writeText(fullUrl)
    message.success('Image URL copied to clipboard')
  }

  const formatFileSize = (bytes) => {
    return uploadService.formatFileSize(bytes)
  }

  const currentCategory = categories.find(cat => cat.value === selectedCategory)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>Image Manager</Title>
        <Text type="secondary">Manage your uploaded images by category</Text>
      </div>

      <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Select
          value={selectedCategory}
          onChange={setSelectedCategory}
          style={{ width: 180 }}
        >
          {categories.map(cat => (
            <Select.Option key={cat.value} value={cat.value}>
              <Tag color={cat.color} style={{ marginRight: 8 }}>
                {cat.label}
              </Tag>
            </Select.Option>
          ))}
        </Select>
        
        <Search
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 250 }}
          prefix={<SearchOutlined />}
        />
        
        <Button 
          type="primary" 
          icon={<UploadOutlined />} 
          onClick={() => setUploadModalVisible(true)}
        >
          Upload Images
        </Button>
        
        <div style={{ marginLeft: 'auto' }}>
          <Text type="secondary">
            {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} in {currentCategory?.label}
          </Text>
        </div>
      </div>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {filteredImages.map((image) => (
            <Col xs={24} sm={12} md={8} lg={6} key={image.filename}>
              <Card
                hoverable
                cover={
                  <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                    <Image
                      src={`${window.location.protocol}//${window.location.hostname}:5000${image.url}`}
                      alt={image.filename}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      preview={{
                        mask: <EyeOutlined style={{ fontSize: 20 }} />
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'rgba(0,0,0,0.6)',
                      borderRadius: 4,
                      padding: '2px 6px'
                    }}>
                      <Text style={{ color: 'white', fontSize: 12 }}>
                        {formatFileSize(image.size)}
                      </Text>
                    </div>
                  </div>
                }
                actions={[
                  <Tooltip title="Copy URL">
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(image.url)}
                    />
                  </Tooltip>,
                  <Tooltip title="View Details">
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<InfoCircleOutlined />}
                      onClick={() => {
                        setSelectedImage(image)
                        setPreviewVisible(true)
                      }}
                    />
                  </Tooltip>,
                  <Popconfirm
                    title="Delete this image?"
                    description="This action cannot be undone."
                    onConfirm={() => handleDelete(image.filename)}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Tooltip title="Delete">
                      <Button 
                        type="text" 
                        danger 
                        size="small" 
                        icon={<DeleteOutlined />}
                      />
                    </Tooltip>
                  </Popconfirm>
                ]}
              >
                <Card.Meta
                  title={
                    <Tooltip title={image.filename}>
                      <div style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {image.filename}
                      </div>
                    </Tooltip>
                  }
                  description={
                    <Space direction="vertical" size={2}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(image.created).toLocaleDateString()}
                      </Text>
                      <Tag color={currentCategory?.color} size="small">
                        {currentCategory?.label}
                      </Tag>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
        
        {filteredImages.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <FolderOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                {searchTerm ? 'No images found matching your search' : `No images in ${currentCategory?.label} category`}
              </Text>
            </div>
            <Button 
              type="primary" 
              style={{ marginTop: 16 }}
              onClick={() => setUploadModalVisible(true)}
            >
              Upload First Image
            </Button>
          </div>
        )}
      </Spin>

      {/* Upload Modal */}
      <Modal
        title={`Upload Images to ${currentCategory?.label}`}
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setUploadModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        <ImageUpload
          category={selectedCategory}
          maxCount={10}
          listType="picture"
          onChange={() => {
            fetchImages()
            message.success('Images uploaded successfully!')
          }}
        />
      </Modal>

      {/* Image Details Modal */}
      <Modal
        title="Image Details"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="copy" onClick={() => copyToClipboard(selectedImage?.url)}>
            Copy URL
          </Button>,
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            Close
          </Button>
        ]}
        width={500}
      >
        {selectedImage && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Image
              src={`${window.location.protocol}//${window.location.hostname}:5000${selectedImage.url}`}
              alt={selectedImage.filename}
              style={{ width: '100%' }}
            />
            <div>
              <Text strong>Filename:</Text> {selectedImage.filename}
            </div>
            <div>
              <Text strong>Size:</Text> {formatFileSize(selectedImage.size)}
            </div>
            <div>
              <Text strong>Category:</Text> <Tag color={currentCategory?.color}>{currentCategory?.label}</Tag>
            </div>
            <div>
              <Text strong>Created:</Text> {new Date(selectedImage.created).toLocaleString()}
            </div>
            <div>
              <Text strong>URL:</Text> 
              <Input.TextArea 
                value={`${window.location.protocol}//${window.location.hostname}:5000${selectedImage.url}`}
                readOnly
                autoSize
                style={{ marginTop: 4 }}
              />
            </div>
          </Space>
        )}
      </Modal>
    </div>
  )
}