import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Badge, Tag } from 'antd'
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { adminApiService } from '../../services/adminApi'

const { TextArea } = Input

export default function Messages() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [viewingMessage, setViewingMessage] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await adminApiService.messages.getAll()
      setData(result)
    } catch (error) {
      message.error('Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (record) => {
    setViewingMessage(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await adminApiService.messages.delete(id)
      message.success('Message deleted successfully')
      fetchData()
    } catch (error) {
      message.error('Failed to delete message')
    }
  }

  const handleUpdateStatus = async (values) => {
    try {
      await adminApiService.messages.update(viewingMessage._id, { status: values.status })
      message.success('Message status updated successfully')
      setModalVisible(false)
      fetchData()
    } catch (error) {
      message.error('Failed to update message status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'red'
      case 'read': return 'orange'
      case 'replied': return 'green'
      default: return 'default'
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record._id)}>
            <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="View Message"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateStatus}>
          <Form.Item name="name" label="Name">
            <Input disabled />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled />
          </Form.Item>
          <Form.Item name="subject" label="Subject">
            <Input disabled />
          </Form.Item>
          <Form.Item name="message" label="Message">
            <TextArea rows={6} disabled />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="new">New</Select.Option>
              <Select.Option value="read">Read</Select.Option>
              <Select.Option value="replied">Replied</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Status
              </Button>
              <Button onClick={() => setModalVisible(false)}>Close</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}