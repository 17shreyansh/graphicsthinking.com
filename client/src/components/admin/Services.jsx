import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, InputNumber, Space, Popconfirm, message, Tag, Rate, Switch, Image } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons'
import { adminApiService } from '../../services/adminApi'
import ImageUpload from './ImageUpload'

const { TextArea } = Input

export default function Services() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log('Fetching services data...')
      const result = await adminApiService.services.getAll()
      console.log('Services API response:', result)
      console.log('Services data length:', result?.length)
      setData(result || [])
    } catch (error) {
      console.error('Services fetch error:', error)
      message.error(`Failed to fetch services: ${error.message}`)
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
    // Handle nested data structure for enhanced schema
    const formData = {
      ...record,
      basePrice: record.pricing?.basePrice || record.price || 0,
      originalPrice: record.pricing?.originalPrice || record.originalPrice || 0,
      estimatedDays: record.delivery?.estimatedDays || parseInt(record.deliveryTime?.match(/\d+/)?.[0]) || 7,
      revisions: record.delivery?.revisions || record.revisions || 3,
      expressDelivery: record.delivery?.expressDelivery || false,
      primaryImage: record.media?.primaryImage || record.image || '',
      features: record.features?.join(', ') || '',
      requirements: record.requirements?.join(', ') || '',
      rating: record.metrics?.rating || record.rating || 5,
      totalOrders: record.metrics?.totalOrders || record.totalOrders || 0,
      reviewCount: record.metrics?.reviewCount || 0,
      views: record.metrics?.views || 0
    }
    form.setFieldsValue(formData)
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await adminApiService.services.delete(id)
      message.success('Service deleted successfully')
      fetchData()
    } catch (error) {
      message.error('Failed to delete service')
    }
  }

  const handleSubmit = async (values) => {
    try {
      // Transform data for enhanced backend schema
      const submitData = {
        name: values.name,
        description: values.description,
        detailedDescription: values.detailedDescription,
        category: values.category,
        pricing: {
          basePrice: values.basePrice,
          originalPrice: values.originalPrice || null,
          currency: 'INR',
          priceType: 'fixed'
        },
        delivery: {
          estimatedDays: values.estimatedDays,
          expressDelivery: values.expressDelivery || false,
          revisions: values.revisions || 3
        },
        media: {
          primaryImage: values.primaryImage || null
        },
        features: values.features ? values.features.split(',').map(f => f.trim()).filter(f => f) : [],
        requirements: values.requirements ? values.requirements.split(',').map(r => r.trim()).filter(r => r) : [],
        status: values.status || 'active',
        visibility: values.visibility || 'public',
        metrics: {
          rating: values.rating || 5,
          totalOrders: values.totalOrders || 0,
          reviewCount: values.reviewCount || 0,
          views: values.views || 0
        }
      }
      
      if (editingItem) {
        await adminApiService.services.update(editingItem._id, submitData)
        message.success('Service updated successfully')
      } else {
        await adminApiService.services.create(submitData)
        message.success('Service created successfully')
      }
      setModalVisible(false)
      fetchData()
    } catch (error) {
      message.error('Failed to save service')
    }
  }

  const columns = [
    {
      title: 'Image',
      key: 'image',
      width: 80,
      render: (_, record) => {
        const image = record.media?.primaryImage || record.image
        return image ? <Image src={image} width={50} height={50} style={{ objectFit: 'cover' }} /> : null
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>
    },
    {
      title: 'Price',
      key: 'price',
      render: (_, record) => {
        const price = record.pricing?.basePrice || record.price || 0
        const originalPrice = record.pricing?.originalPrice || record.originalPrice
        return (
          <div>
            <div>₹{price.toLocaleString()}</div>
            {originalPrice && originalPrice > price && (
              <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '12px' }}>
                ₹{originalPrice.toLocaleString()}
              </div>
            )}
          </div>
        )
      }
    },
    {
      title: 'Delivery',
      key: 'delivery',
      render: (_, record) => {
        const days = record.delivery?.estimatedDays || parseInt(record.deliveryTime?.match(/\d+/)?.[0]) || 7
        return `${days} days`
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : status === 'inactive' ? 'red' : 'orange'}>
          {status?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Visibility',
      dataIndex: 'visibility',
      key: 'visibility',
      render: (visibility) => (
        <Tag color={visibility === 'featured' ? 'gold' : visibility === 'public' ? 'blue' : 'default'}>
          {visibility?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (_, record) => {
        const rating = record.metrics?.rating || record.rating || 5
        return <Rate disabled defaultValue={rating} style={{ fontSize: 12 }} />
      }
    },
    {
      title: 'Orders',
      key: 'orders',
      render: (_, record) => record.metrics?.totalOrders || record.totalOrders || 0
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
          Add Service
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record._id || record.id || Math.random().toString()}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1400 }}
      />

      <Modal
        title={editingItem ? 'Edit Service' : 'Add Service'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} preserve={false}>
          <Form.Item name="name" label="Service Name" rules={[{ required: true, max: 200 }]}>
            <Input placeholder="Enter service name" />
          </Form.Item>
          
          <Form.Item name="description" label="Description" rules={[{ required: true, max: 500 }]}>
            <TextArea rows={3} placeholder="Brief service description" />
          </Form.Item>
          
          <Form.Item name="detailedDescription" label="Detailed Description">
            <TextArea rows={4} placeholder="Detailed service information" />
          </Form.Item>
          
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              <Select.Option value="Branding">Branding</Select.Option>
              <Select.Option value="Digital Marketing">Digital Marketing</Select.Option>
              <Select.Option value="Print Design">Print Design</Select.Option>
              <Select.Option value="Web Design">Web Design</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="basePrice" label="Base Price" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} placeholder="5000" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="originalPrice" label="Original Price" style={{ flex: 1 }}>
              <InputNumber min={0} placeholder="7000" style={{ width: '100%' }} />
            </Form.Item>
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="estimatedDays" label="Delivery Days" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={1} max={365} defaultValue={7} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="revisions" label="Revisions" style={{ flex: 1 }}>
              <InputNumber min={0} max={10} defaultValue={3} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          
          <Form.Item name="primaryImage" label="Primary Image">
            <ImageUpload
              category="services"
              maxCount={1}
              value={form.getFieldValue('primaryImage')}
              onChange={(url) => form.setFieldsValue({ primaryImage: url })}
            />
          </Form.Item>
          
          <Form.Item name="features" label="Features (comma separated)">
            <TextArea rows={2} placeholder="Logo design, Brand guidelines, Color palette" />
          </Form.Item>
          
          <Form.Item name="requirements" label="Requirements (comma separated)">
            <TextArea rows={2} placeholder="Company name, Preferred colors, Industry type" />
          </Form.Item>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="status" label="Status" style={{ flex: 1 }}>
              <Select defaultValue="active">
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
                <Select.Option value="draft">Draft</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item name="visibility" label="Visibility" style={{ flex: 1 }}>
              <Select defaultValue="public">
                <Select.Option value="public">Public</Select.Option>
                <Select.Option value="featured">Featured</Select.Option>
                <Select.Option value="private">Private</Select.Option>
              </Select>
            </Form.Item>
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="rating" label="Rating" style={{ flex: 1 }}>
              <Rate allowHalf defaultValue={5} />
            </Form.Item>
            
            <Form.Item name="totalOrders" label="Total Orders" style={{ flex: 1 }}>
              <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="reviewCount" label="Review Count" style={{ flex: 1 }}>
              <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="views" label="Views" style={{ flex: 1 }}>
              <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          
          <Form.Item name="expressDelivery" label="Express Delivery Available" valuePropName="checked">
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