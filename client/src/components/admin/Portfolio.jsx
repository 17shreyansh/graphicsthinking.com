import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, Switch, Space, Popconfirm, message, Image, Tag, InputNumber } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { adminApiService } from '../../services/adminApi'
import ImageUpload from './ImageUpload'

const { TextArea } = Input

export default function Portfolio() {
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
      const result = await adminApiService.portfolio.getAll()
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
    console.log('Editing record:', record)
    console.log('Record _id:', record._id, 'Type:', typeof record._id)
    setEditingItem(record)
    const formData = {
      ...record,
      tags: record.tags?.join(', ') || '',
      technologies: record.technologies?.join(', ') || '',
      images: record.images?.join('\n') || '',
      views: record.metrics?.views || 0,
      likes: record.metrics?.likes || 0,
      slug: record.seo?.slug || record.slug || ''
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
      const submitData = {
        ...values,
        tags: values.tags ? values.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        technologies: values.technologies ? values.technologies.split(',').map(t => t.trim()).filter(t => t) : [],
        images: values.images ? values.images.split('\n').map(i => i.trim()).filter(i => i) : [],
        seo: {
          slug: values.slug || null
        }
      }
      
      if (editingItem) {
        const rawId = editingItem._id || editingItem.id
        console.log('Raw ID:', rawId, 'Type:', typeof rawId)
        
        let id
        if (typeof rawId === 'object' && rawId !== null) {
          // Handle MongoDB ObjectId
          if (rawId.$oid) {
            id = rawId.$oid
          } else if (rawId.buffer && typeof rawId.buffer === 'object') {
            // Convert buffer to hex string
            const buffer = rawId.buffer
            id = Object.values(buffer).map(byte => byte.toString(16).padStart(2, '0')).join('')
          } else if (rawId.toString && typeof rawId.toString === 'function') {
            const stringId = rawId.toString()
            id = stringId !== '[object Object]' ? stringId : null
          } else {
            id = null
          }
        } else {
          id = String(rawId)
        }
        
        console.log('Converted ID:', id, 'Type:', typeof id)
        
        if (!id || typeof id !== 'string' || id === '[object Object]' || id === 'null' || id === 'undefined' || id.length !== 24) {
          throw new Error(`Invalid ID for update: ${id}`)
        }
        
        await adminApiService.portfolio.update(id, submitData)
        message.success('Portfolio item updated successfully')
      } else {
        await adminApiService.portfolio.create(submitData)
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
          <Popconfirm title="Are you sure?" onConfirm={() => {
            const rawId = record._id || record.id
            let id
            if (typeof rawId === 'object' && rawId !== null) {
              if (rawId.$oid) {
                id = rawId.$oid
              } else if (rawId.buffer && typeof rawId.buffer === 'object') {
                const buffer = rawId.buffer
                id = Object.values(buffer).map(byte => byte.toString(16).padStart(2, '0')).join('')
              } else {
                const stringId = rawId.toString()
                id = stringId !== '[object Object]' ? stringId : null
              }
            } else {
              id = String(rawId)
            }
            handleDelete(id)
          }}>
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
        rowKey={(record) => {
          const rawKey = record._id || record.id
          let key
          if (typeof rawKey === 'object' && rawKey !== null) {
            if (rawKey.$oid) {
              key = rawKey.$oid
            } else if (rawKey.buffer && typeof rawKey.buffer === 'object') {
              const buffer = rawKey.buffer
              key = Object.values(buffer).map(byte => byte.toString(16).padStart(2, '0')).join('')
            } else {
              const stringKey = rawKey.toString()
              key = stringKey !== '[object Object]' ? stringKey : null
            }
          } else {
            key = String(rawKey)
          }
          return (typeof key === 'string' && key !== '[object Object]' && key !== 'null') ? key : `temp-${Date.now()}-${Math.random()}`
        }}
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
        <Form form={form} layout="vertical" onFinish={handleSubmit} preserve={false}>
          <Form.Item name="title" label="Title" rules={[{ required: true, max: 200 }]}>
            <Input 
              placeholder="Enter portfolio title" 
              onChange={(e) => {
                const title = e.target.value
                const slug = title.toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, '')
                if (slug && !editingItem) {
                  form.setFieldsValue({ slug })
                }
              }}
            />
          </Form.Item>
          
          <Form.Item name="slug" label="URL Slug" rules={[{ pattern: /^[a-z0-9-]+$/, message: 'Only lowercase letters, numbers, and hyphens allowed' }]}>
            <Input placeholder="url-friendly-slug (auto-generated from title)" />
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
          
          <Form.Item name="image" label="Primary Image" rules={[{ required: true }]}>
            <ImageUpload
              category="portfolio"
              maxCount={1}
              value={form.getFieldValue('image')}
              onChange={(url) => form.setFieldsValue({ image: url })}
            />
          </Form.Item>
          
          <Form.Item name="images" label="Additional Images">
            <ImageUpload
              category="portfolio"
              maxCount={5}
              value={form.getFieldValue('images')?.split('\n').filter(Boolean) || []}
              onChange={(urls) => form.setFieldsValue({ images: urls.join('\n') })}
            />
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