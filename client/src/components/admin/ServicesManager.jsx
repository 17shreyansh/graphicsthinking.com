import { Table, Button, Space, Popconfirm, Tag, Image, Typography } from 'antd'
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, ClearOutlined } from '@ant-design/icons'

const { Title } = Typography

const ServicesManager = ({ 
  services, 
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
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat) => <Tag color="green">{cat}</Tag> },
    { title: 'Delivery Time', dataIndex: 'deliveryTime', key: 'deliveryTime' },
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
        <Title level={2}>Services Management</Title>
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
            Add Service
          </Button>
        </Space>
      </div>
      <Table 
        rowSelection={rowSelection}
        columns={columns} 
        dataSource={services} 
        rowKey="_id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default ServicesManager