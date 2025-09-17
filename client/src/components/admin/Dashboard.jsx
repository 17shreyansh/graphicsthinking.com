import { Row, Col, Card, Statistic, Typography, Button, Image, Tag } from 'antd'
import { FileImageOutlined, AppstoreOutlined, EditOutlined, MessageOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const Dashboard = ({ stats, portfolioItems, messages, onMenuSelect }) => {
  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic 
              title="Portfolio Items" 
              value={stats.totalPortfolio} 
              prefix={<FileImageOutlined style={{ color: '#667eea' }} />}
              valueStyle={{ color: '#667eea' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic 
              title="Services" 
              value={stats.totalServices} 
              prefix={<AppstoreOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic 
              title="Blog Posts" 
              value={stats.totalBlogs} 
              prefix={<EditOutlined style={{ color: '#f59e0b' }} />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic 
              title="New Messages" 
              value={stats.newMessages} 
              prefix={<MessageOutlined style={{ color: '#ef4444' }} />}
              valueStyle={{ color: stats.newMessages > 0 ? '#ef4444' : '#6b7280' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col span={12}>
          <Card 
            title="Recent Portfolio Items" 
            extra={<Button type="link" onClick={() => onMenuSelect('portfolio')}>View All</Button>}
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            {portfolioItems.slice(0, 5).map(item => (
              <div key={item._id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: 12,
                padding: 8,
                borderRadius: 6,
                background: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}>
                <Image 
                  width={40} 
                  height={40} 
                  src={item.image || 'https://via.placeholder.com/40'} 
                  style={{ marginRight: 12, objectFit: 'cover', borderRadius: 4 }} 
                />
                <div>
                  <Text strong>{item.title}</Text>
                  <br />
                  <Tag color="blue" size="small">{item.category}</Tag>
                </div>
              </div>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title="Recent Messages" 
            extra={<Button type="link" onClick={() => onMenuSelect('messages')}>View All</Button>}
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            {messages.slice(0, 5).map(msg => (
              <div key={msg._id} style={{ 
                marginBottom: 12,
                padding: 12,
                borderRadius: 6,
                background: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>{msg.name}</Text>
                  <Tag color={msg.status === 'new' ? 'red' : msg.status === 'read' ? 'orange' : 'green'}>
                    {msg.status}
                  </Tag>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>{msg.subject}</Text>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard