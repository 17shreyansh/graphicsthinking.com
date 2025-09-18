import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Switch, Upload, message, Drawer, Descriptions, Badge, Image, Button } from 'antd'
import AdminAuth from '../components/AdminAuth'
import AdminLayout from '../components/admin/AdminLayout'
import Dashboard from '../components/admin/Dashboard'
import PortfolioManager from '../components/admin/PortfolioManager'

import ServicesManager from '../components/admin/ServicesManager'
import MessagesManager from '../components/admin/MessagesManager'
import Settings from '../components/admin/Settings'

import { portfolioAPI, servicesAPI, contactAPI } from '../services/api'

const { TextArea } = Input

export default function AdminPanelNew() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form] = Form.useForm()
  
  const [portfolioItems, setPortfolioItems] = useState([])
  const [services, setServices] = useState([])

  const [messages, setMessages] = useState([])
  const [stats, setStats] = useState({})
  const [selectedRowKeys, setSelectedRowKeys] = useState([])


  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      fetchAllData()
    }
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [portfolioRes, servicesRes, messagesRes] = await Promise.all([
        portfolioAPI.getAll(),
        servicesAPI.getAll(),
        contactAPI.getAll()
      ])
      
      setPortfolioItems(portfolioRes.items || portfolioRes || [])
      setServices(servicesRes.services || servicesRes || [])
      setMessages(messagesRes.messages || messagesRes || [])
      
      setStats({
        totalPortfolio: (portfolioRes.items || portfolioRes || []).length,
        totalServices: (servicesRes.services || servicesRes || []).length,
        totalMessages: (messagesRes.messages || messagesRes || []).length,
        newMessages: (messagesRes.messages || messagesRes || []).filter(m => m.status === 'new').length
      })
    } catch (error) {
      message.error('Failed to fetch data')
    }
    setLoading(false)
  }

  const handleSave = async (values) => {
    setLoading(true)
    try {
      let api, data = { ...values }
      
      switch (selectedMenu) {
        case 'portfolio':
          api = portfolioAPI
          break
        case 'services':
          api = servicesAPI
          break
        default:
          return
      }
      
      if (editingItem) {
        await api.update(editingItem._id, data)
        message.success('Updated successfully')
      } else {
        await api.create(data)
        message.success('Created successfully')
      }
      
      setModalVisible(false)
      setEditingItem(null)
      form.resetFields()
      setShowBlogEditor(false)
      setEditingBlog(null)
      fetchAllData()
    } catch (error) {
      message.error('Failed to save')
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    setLoading(true)
    try {
      let api
      switch (selectedMenu) {
        case 'portfolio':
          api = portfolioAPI
          break
        case 'services':
          api = servicesAPI
          break
        case 'messages':
          api = contactAPI
          break
        default:
          return
      }
      
      await api.delete(id)
      message.success('Deleted successfully')
      fetchAllData()
    } catch (error) {
      message.error('Failed to delete')
    }
    setLoading(false)
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



  const openDrawer = (item) => {
    setEditingItem(item)
    setDrawerVisible(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
    message.success('Logged out successfully')
  }

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select items to delete')
      return
    }
    
    setLoading(true)
    try {
      await fetch('/api/admin/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedMenu, ids: selectedRowKeys })
      })
      message.success(`${selectedRowKeys.length} items deleted successfully`)
      setSelectedRowKeys([])
      fetchAllData()
    } catch (error) {
      message.error('Failed to delete items')
    }
    setLoading(false)
  }

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/admin/export/${selectedMenu}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedMenu}-export.json`
      a.click()
      window.URL.revokeObjectURL(url)
      message.success('Data exported successfully')
    } catch (error) {
      message.error('Failed to export data')
    }
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  }

  if (!isAuthenticated) {
    return <AdminAuth onLogin={setIsAuthenticated} />
  }

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats}
            portfolioItems={portfolioItems}
            messages={messages}
            onMenuSelect={setSelectedMenu}
          />
        )

      case 'portfolio':
        return (
          <PortfolioManager
            portfolioItems={portfolioItems}
            loading={loading}
            selectedRowKeys={selectedRowKeys}
            rowSelection={rowSelection}
            onEdit={openModal}
            onView={openDrawer}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            onExport={handleExport}
            onAdd={() => openModal()}
          />
        )



      case 'services':
        return (
          <ServicesManager
            services={services}
            loading={loading}
            selectedRowKeys={selectedRowKeys}
            rowSelection={rowSelection}
            onEdit={openModal}
            onView={openDrawer}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            onExport={handleExport}
            onAdd={() => openModal()}
          />
        )

      case 'messages':
        return (
          <MessagesManager
            messages={messages}
            loading={loading}
            selectedRowKeys={selectedRowKeys}
            rowSelection={rowSelection}
            onEdit={openModal}
            onView={openDrawer}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            onExport={handleExport}
          />
        )

      case 'settings':
        return <Settings stats={stats} />

      default:
        return <div>Select a menu item</div>
    }
  }

  const renderModalForm = () => {
    if (selectedMenu === 'portfolio') {
      return (
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Logo Design">Logo Design</Select.Option>
              <Select.Option value="Social Media">Social Media</Select.Option>
              <Select.Option value="Print Design">Print Design</Select.Option>
              <Select.Option value="Web Design">Web Design</Select.Option>
              <Select.Option value="Branding">Branding</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="client" label="Client">
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image URL">
            <Input />
          </Form.Item>
          <Form.Item name="featured" label="Featured" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      )
    }



    if (selectedMenu === 'services') {
      return (
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Service Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Design Services">Design Services</Select.Option>
              <Select.Option value="Branding">Branding</Select.Option>
              <Select.Option value="Digital">Digital</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="deliveryTime" label="Delivery Time">
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image URL">
            <Input />
          </Form.Item>
        </Form>
      )
    }

    if (selectedMenu === 'messages') {
      return (
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="new">New</Select.Option>
              <Select.Option value="read">Read</Select.Option>
              <Select.Option value="replied">Replied</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="replyMessage" label="Reply Message">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      )
    }
  }

  return (
    <AdminLayout 
      selectedMenu={selectedMenu} 
      onMenuSelect={setSelectedMenu} 
      onLogout={handleLogout}
    >
      {renderContent()}

      <Modal
        title={editingItem ? 'Edit Item' : 'Add Item'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingItem(null)
          form.resetFields()
        }}
        footer={null}
        width={800}
        destroyOnHidden
      >
        {renderModalForm()}
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" loading={loading} onClick={() => form.submit()}>
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </div>
      </Modal>

      <Drawer
        title="Item Details"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={600}
      >
        {editingItem && (
          <Descriptions column={1} bordered>
            {Object.entries(editingItem).map(([key, value]) => {
              if (key === '_id' || key === '__v') return null
              if (key === 'image') {
                return (
                  <Descriptions.Item key={key} label={key}>
                    <Image width={100} src={value} />
                  </Descriptions.Item>
                )
              }
              if (typeof value === 'boolean') {
                return (
                  <Descriptions.Item key={key} label={key}>
                    <Badge status={value ? 'success' : 'default'} text={value ? 'Yes' : 'No'} />
                  </Descriptions.Item>
                )
              }
              return (
                <Descriptions.Item key={key} label={key}>
                  {value}
                </Descriptions.Item>
              )
            })}
          </Descriptions>
        )}
      </Drawer>
    </AdminLayout>
  )
}