import { Table, Button, Space, Popconfirm, Tag, Image, Badge, Typography } from 'antd'
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, ClearOutlined } from '@ant-design/icons'

const { Title } = Typography

const BlogManager = ({ 
  blogPosts, 
  loading, 
  selectedRowKeys, 
  rowSelection, 
  onEdit, 
  onView, 
  onDelete, 
  onBulkDelete, 
  onExport, 
  onAdd 
}) => {
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image width={50} height={50} src={image || 'https://via.placeholder.com/50'} style={{ objectFit: 'cover' }} />
    },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat) => <Tag color="purple">{cat}</Tag> },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    { 
      title: 'Published', 
      dataIndex: 'published', 
      key: 'published',
      render: (published) => <Badge status={published ? 'success' : 'error'} text={published ? 'Published' : 'Draft'} />
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
        <Title level={2}>Blog Management</Title>
        <Space>
          {selectedRowKeys.length > 0 && (
            <Button icon={<ClearOutlined />} danger onClick={onBulkDelete}>
              Delete Selected ({selectedRowKeys.length})
            </Button>
          )}
          <Button icon={<DownloadOutlined />} onClick={onExport}>
            Export
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Add Blog Post
          </Button>
        </Space>
      </div>
      <Table 
        rowSelection={rowSelection}
        columns={columns} 
        dataSource={blogPosts} 
        rowKey="_id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default BlogManager