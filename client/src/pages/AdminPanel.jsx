import { useState, useEffect } from 'react'
import { Layout, Menu, Table, Button, Modal, Form, Input, Select, Upload, message, Tabs, Card } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import axios from 'axios'

const { Header, Sider, Content } = Layout
const { TabPane } = Tabs
const { TextArea } = Input

export default function AdminPanel() {
  const [services, setServices] = useState([])
  const [portfolioItems, setPortfolioItems] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [messages, setMessages] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeTab, setActiveTab] = useState('services')
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [servicesRes, portfolioRes, blogRes] = await Promise.all([
        axios.get('/api/services'),
        axios.get('/api/portfolio'),
        axios.get('/api/blog')
      ])
      setServices(servicesRes.data)
      setPortfolioItems(portfolioRes.data)
      setBlogPosts(blogRes.data)
    } catch (error) {
      message.error('Failed to fetch data')
    }
  }

  const handleSave = async (values) => {
    try {
      const endpoint = `/api/${activeTab}`
      if (editingItem) {
        await axios.put(`${endpoint}/${editingItem._id}`, values)
        message.success('Updated successfully')
      } else {
        await axios.post(endpoint, values)
        message.success('Created successfully')
      }
      setModalVisible(false)
      setEditingItem(null)
      form.resetFields()
      fetchData()
    } catch (error) {
      message.error('Failed to save')
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/${activeTab}/${id}`)
      message.success('Deleted successfully')
      fetchData()
    } catch (error) {
      message.error('Failed to delete')
    }
  }

  const openModal = (item = null) => {
    setEditingItem(item)
    if (item) {
      form.setFieldsValue(item)
    } else {
      form.resetFields()
    }
    setModalVisible(true)
  }

  const serviceColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `$${price}` },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} style={{ marginRight: 8 }} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record._id)} />
        </>
      )
    }
  ]

  const portfolioColumns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} style={{ marginRight: 8 }} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record._id)} />
        </>
      )
    }
  ]

  const renderForm = () => {
    if (activeTab === 'services') {
      return (
        <>
          <Form.Item name="name" label="Service Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </>
      )
    }
    
    if (activeTab === 'portfolio') {
      return (
        <>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Logos">Logos</Select.Option>
              <Select.Option value="Posters">Posters</Select.Option>
              <Select.Option value="Social Media">Social Media</Select.Option>
              <Select.Option value="Digital Art">Digital Art</Select.Option>
              <Select.Option value="Branding">Branding</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="image" label="Image URL" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </>
      )
    }
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#E53E3E', padding: '0 24px' }}>
        <h1 style={{ color: 'white', margin: 0, fontFamily: 'Anton', fontSize: '24px' }}>
          GRAPHICS THINKING ADMIN
        </h1>
      </Header>
      
      <Layout>
        <Content style={{ padding: '24px' }}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Services" key="services">
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Add Service
                  </Button>
                </div>
                <Table columns={serviceColumns} dataSource={services} rowKey="_id" />
              </TabPane>
              
              <TabPane tab="Portfolio" key="portfolio">
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Add Portfolio Item
                  </Button>
                </div>
                <Table columns={portfolioColumns} dataSource={portfolioItems} rowKey="_id" />
              </TabPane>
              
              <TabPane tab="Blog Posts" key="blog">
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Add Blog Post
                  </Button>
                </div>
                <Table dataSource={blogPosts} rowKey="_id" />
              </TabPane>
              
              <TabPane tab="Messages" key="messages">
                <Table dataSource={messages} rowKey="_id" />
              </TabPane>
            </Tabs>
          </Card>
        </Content>
      </Layout>

      <Modal
        title={editingItem ? 'Edit Item' : 'Add Item'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSave} layout="vertical">
          {renderForm()}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              {editingItem ? 'Update' : 'Create'}
            </Button>
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}