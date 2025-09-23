import { useState, useEffect } from 'react'
import { Upload, message, Image, Button, Space, Modal, Progress, Card, Typography } from 'antd'
import { PlusOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons'
import { uploadService } from '../../services/uploadService'

const { Text } = Typography

export default function ImageUpload({ 
  value, 
  onChange, 
  category = 'general', 
  maxCount = 1, 
  listType = 'picture-card',
  accept = 'image/*'
}) {
  const [fileList, setFileList] = useState([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        setFileList(value.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url: url
        })))
      } else if (typeof value === 'string') {
        setFileList([{
          uid: '-1',
          name: 'image',
          status: 'done',
          url: value
        }])
      }
    } else {
      setFileList([])
    }
  }, [value])

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const handleCancel = () => setPreviewVisible(false)

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    
    // Extract URLs from successful uploads
    const urls = newFileList
      .filter(file => file.status === 'done')
      .map(file => {
        if (file.response && file.response.success) {
          return `${window.location.protocol}//${window.location.hostname}:5000${file.response.file.url}`
        }
        return file.url
      })
      .filter(Boolean)

    if (maxCount === 1) {
      onChange(urls[0] || '')
    } else {
      onChange(urls)
    }
  }

  const handleRemove = async (file) => {
    try {
      if (file.response && file.response.file.url) {
        await uploadService.deleteFile(file.response.file.url)
      }
      return true
    } catch (error) {
      console.error('Error deleting file:', error)
      message.error('Failed to delete file from server')
      return false
    }
  }

  const beforeUpload = (file) => {
    const validation = uploadService.validateFile(file)
    if (!validation.isValid) {
      validation.errors.forEach(error => message.error(error))
      return false
    }
    return true
  }

  const customRequest = async ({ file, onProgress, onSuccess, onError }) => {
    try {
      setUploading(true)
      
      // Validate file first
      const validation = uploadService.validateFile(file)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      const result = await uploadService.uploadSingle(file, category, onProgress)
      
      if (result.success) {
        onSuccess(result, file)
        message.success('Image uploaded successfully!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      onError(error)
      message.error('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  if (listType === 'picture-card') {
    return (
      <>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          onRemove={handleRemove}
          beforeUpload={beforeUpload}
          customRequest={customRequest}
          accept={accept}
          maxCount={maxCount}
        >
          {fileList.length >= maxCount ? null : uploadButton}
        </Upload>
        
        <Modal
          open={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    )
  }

  return (
    <Card>
      <Upload
        listType="picture"
        fileList={fileList}
        onChange={handleChange}
        onRemove={handleRemove}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        accept={accept}
        maxCount={maxCount}
        showUploadList={{
          showPreviewIcon: true,
          showRemoveIcon: true,
          showDownloadIcon: false,
        }}
      >
        <Button icon={<UploadOutlined />} loading={uploading}>
          {uploading ? 'Uploading...' : 'Select Images'}
        </Button>
      </Upload>
      
      {fileList.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">
            {fileList.length} image(s) selected
          </Text>
        </div>
      )}
    </Card>
  )
}