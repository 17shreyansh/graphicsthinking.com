import { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, List, Avatar, Badge, Spin, Alert } from 'antd'
import { UserOutlined, ProjectOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
import { adminApiService } from '../../services/adminApi'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      console.log('Fetching dashboard stats...')
      const data = await adminApiService.dashboard.getStats()
      console.log('Dashboard API response:', data)
      setStats(data)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
  if (error) return <Alert message="Error" description={error} type="error" showIcon />

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Portfolio Items"
              value={stats?.portfolio.total || 0}
              prefix={<ProjectOutlined />}
              suffix={`(${stats?.portfolio.featured || 0} featured)`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Services"
              value={stats?.services.total || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Messages"
              value={stats?.messages.total || 0}
              prefix={<MessageOutlined />}
              suffix={`(${stats?.messages.new || 0} new)`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Content"
              value={(stats?.portfolio.total || 0) + (stats?.services.total || 0)}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Recent Portfolio" size="small">
            <List
              itemLayout="horizontal"
              dataSource={stats?.portfolio.recent || []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.image} icon={<ProjectOutlined />} />}
                    title={item.title}
                    description={item.category}
                  />
                  {item.featured && <Badge status="success" text="Featured" />}
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Messages" size="small">
            <List
              itemLayout="horizontal"
              dataSource={stats?.messages.recent || []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<MessageOutlined />} />}
                    title={item.name}
                    description={item.subject}
                  />
                  <Badge 
                    status={item.status === 'new' ? 'error' : item.status === 'read' ? 'warning' : 'success'} 
                    text={item.status} 
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}