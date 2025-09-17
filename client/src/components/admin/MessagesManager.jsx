import { Table, Button, Space, Popconfirm, Tag, Avatar, Typography } from 'antd'
import { EyeOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, ClearOutlined, UserOutlined } from '@ant-design/icons'

const { Title } = Typography

const MessagesManager = ({ 
  messages, 
  loading, 
  selectedRowKeys, 
  rowSelection, 
  onEdit, 
  onView, 
  onDelete, 
  onBulkDelete, 
  onExport 
}) => {
  const columns = [
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (name) => <><Avatar icon={<UserOutlined />} size="small" /> {name}</>
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const color = status === 'new' ? 'red' : status === 'read' ? 'orange' : 'green'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      }
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
          <Button icon={<EyeOutlined />} onClick={() => onView(record)} />
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm title="Sure to delete?" onConfirm={() => onDelete(record._id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Messages Management</Title>
        <Space>
          {selectedRowKeys.length > 0 && (
            <Button icon={<ClearOutlined />} danger onClick={onBulkDelete}>
              Delete Selected ({selectedRowKeys.length})
            </Button>
          )}
          <Button icon={<DownloadOutlined />} onClick={onExport}>
            Export
          </Button>
        </Space>
      </div>
      <Table 
        rowSelection={rowSelection}
        columns={columns} 
        dataSource={messages} 
        rowKey="_id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default MessagesManager