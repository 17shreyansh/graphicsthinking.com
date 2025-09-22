import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, Switch, Space, Popconfirm, message, Image, Tag, InputNumber } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { adminApiService } from '../../services/adminApi'

const { TextArea } = Input

export default function Portfolio() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    testConnection()
    fetchData()
  }, [])

  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/debug')
      const data = await response.json()
      console.log('Server debug info:', data)
    } catch (error) {
      console.error('Server connection failed:', error)
      message.error('Cannot connect to server. Please start the backend.')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log('Fetching portfolio data...')
      const result = await adminApiService.portfolio.getAll()
      console.log('Portfolio API response:', result)
      setData(result || [])
    } catch (error) {
      console.error('Portfolio fetch error:', error)
      message.error(`Failed to fetch portfolio: ${error.message}`)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditingItem(record)
    // Handle nested data structure
    const formData = {
      ...record,
      tags: record.tags?.join(', ') || '',
      technologies: record.technologies?.join(', ') || '',
      images: record.images?.join('\n') || '',
      views: record.metrics?.views || 0,
      likes: record.metrics?.likes || 0
    }
    form.setFieldsValue(formData)
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await adminApiService.portfolio.delete(id)
      message.success('Portfolio item deleted successfully')
      fetchData()
    } catch (error) {
      message.error('Failed to delete portfolio item')
    }
  }

  const handleSubmit = async (values) => {
    try {
      console.log('Submitting portfolio data:', values)
      const submitData = {
        ...values,
        tags: values.tags ? values.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        technologies: values.technologies ? values.technologies.split(',').map(t => t.trim()).filter(t => t) : [],
        images: values.images ? values.images.split('\n').map(i => i.trim()).filter(i => i) : []
      }
      console.log('Transformed data:', submitData)
      
      if (editingItem) {
        const result = await adminApiService.portfolio.update(editingItem._id, submitData)
        console.log('Update result:', result)
        message.success('Portfolio item updated successfully')
      } else {
        const result = await adminApiService.portfolio.create(submitData)
        console.log('Create result:', result)
        message.success('Portfolio item created successfully')
      }
      setModalVisible(false)
      fetchData()
    } catch (error) {
      console.error('Portfolio submit error:', error)
      message.error(`Failed to save: ${error.message || error}`)
    }
  }

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image) => <Image src={image} width={50} height={50} style={{ objectFit: 'cover' }} />
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'published' ? 'green' : status === 'draft' ? 'orange' : 'red'}>
          {status?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      render: (featured) => <Tag color={featured ? 'gold' : 'default'}>{featured ? 'Yes' : 'No'}</Tag>
    },
    {
      title: 'Views',
      dataIndex: ['metrics', 'views'],
      key: 'views',
      render: (views) => views || 0
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record._id)}>
            <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Portfolio Item
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Title" rules={[{ required: true, max: 200 }]}>
            <Input placeholder="Enter portfolio title" />
          </Form.Item>
          
          <Form.Item name="description" label="Description" rules={[{ required: true, max: 500 }]}>
            <TextArea rows={3} placeholder="Brief description" />
          </Form.Item>
          
          <Form.Item name="detailedDescription" label="Detailed Description">
            <TextArea rows={4} placeholder="Detailed project description" />
          </Form.Item>
          
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              <Select.Option value="Logo Design">Logo Design</Select.Option>
              <Select.Option value="Social Media">Social Media</Select.Option>
              <Select.Option value="Print Design">Print Design</Select.Option>
              <Select.Option value="Branding">Branding</Select.Option>
              <Select.Option value="Web Design">Web Design</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="image" label="Primary Image URL" rules={[{ required: true }]}>
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
          
          <Form.Item name="images" label="Additional Images (one per line)">
            <TextArea rows={3} placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg" />
          </Form.Item>
          
          <Form.Item name="client" label="Client">
            <Input placeholder="Client name" />
          </Form.Item>
          
          <Form.Item name="projectUrl" label="Project URL">
            <Input placeholder="https://project-url.com" />
          </Form.Item>
          
          <Form.Item name="tags" label="Tags (comma separated)">
            <Input placeholder="design, branding, logo" />
          </Form.Item>
          
          <Form.Item name="technologies" label="Technologies (comma separated)">
            <Input placeholder="Photoshop, Illustrator, Figma" />
          </Form.Item>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="status" label="Status" style={{ flex: 1 }}>
              <Select defaultValue="published">
                <Select.Option value="draft">Draft</Select.Option>
                <Select.Option value="published">Published</Select.Option>
                <Select.Option value="archived">Archived</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item name="priority" label="Priority (0-100)" style={{ flex: 1 }}>
              <InputNumber min={0} max={100} defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="views" label="Views" style={{ flex: 1 }}>
              <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="likes" label="Likes" style={{ flex: 1 }}>
              <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          
          <Form.Item name="featured" label="Featured" valuePropName="checked">
            <Switch />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}