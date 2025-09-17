import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

const { Title } = Typography

const AdminAuth = ({ onLogin }) => {
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      // Get stored password or use default
      const storedPassword = localStorage.getItem('adminPassword') || 'graphics2024'
      
      if (values.username === 'admin' && values.password === storedPassword) {
        localStorage.setItem('adminAuth', 'true')
        message.success('Login successful!')
        onLogin(true)
      } else {
        message.error('Invalid credentials')
      }
    } catch (error) {
      message.error('Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
            Graphics Thinking
          </Title>
          <Title level={4} style={{ color: '#666', fontWeight: 'normal' }}>
            Admin Panel
          </Title>
        </div>
        
        <Form
          name="admin-login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%', height: 45 }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: 16, color: '#999', fontSize: '12px' }}>
          Demo credentials: admin / graphics2024
        </div>
      </Card>
    </div>
  )
}

export default AdminAuth