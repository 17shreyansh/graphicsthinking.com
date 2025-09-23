import { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, List, Avatar, Badge, Spin, Alert, Typography } from 'antd'
import { UserOutlined, ProjectOutlined, MessageOutlined, StarOutlined, FileImageOutlined } from '@ant-design/icons'
import { adminApiService } from '../../services/adminApi'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const dashboardData = await adminApiService.dashboard.getStats()
      setStats({
        totalPortfolio: dashboardData.portfolio.total,
        featuredPortfolio: dashboardData.portfolio.featured,
        totalServices: dashboardData.services.total,
        totalMessages: dashboardData.messages.total,
        newMessages: dashboardData.messages.new
      })
      setRecent({
        portfolio: dashboardData.portfolio.recent,
        messages: dashboardData.messages.recent,
        services: dashboardData.services.recent
      })
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError(err.message || 'Failed to load dashboard data')
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
              value={stats?.totalPortfolio || 0}
              prefix={<ProjectOutlined />}
              suffix={`(${stats?.featuredPortfolio || 0} featured)`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Services"
              value={stats?.totalServices || 0}
              prefix={<UserOutlined />}
              suffix={`(${stats?.popularServices || 0} popular)`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Messages"
              value={stats?.totalMessages || 0}
              prefix={<MessageOutlined />}
              suffix={`(${stats?.newMessages || 0} new)`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Content"
              value={(stats?.totalPortfolio || 0) + (stats?.totalServices || 0)}
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
              dataSource={recent?.portfolio || []}
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
              dataSource={recent?.messages || []}
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