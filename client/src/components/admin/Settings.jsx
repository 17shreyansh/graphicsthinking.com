import { Row, Col, Card, Form, Input, Button, Descriptions, Typography, message } from 'antd'

const { Title } = Typography

const Settings = ({ stats }) => {
  return (
    <div>
      <Title level={2}>Settings</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Change Password" style={{ marginBottom: 16 }}>
            <Form
              layout="vertical"
              onFinish={(values) => {
                if (values.newPassword !== values.confirmPassword) {
                  message.error('Passwords do not match')
                  return
                }
                localStorage.setItem('adminPassword', values.newPassword)
                message.success('Password changed successfully')
              }}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter current password' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                rules={[{ required: true, message: 'Please confirm new password' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="System Information">
            <Descriptions column={1}>
              <Descriptions.Item label="Admin User">admin</Descriptions.Item>
              <Descriptions.Item label="Last Login">{new Date().toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Total Portfolio Items">{stats.totalPortfolio}</Descriptions.Item>
              <Descriptions.Item label="Total Services">{stats.totalServices}</Descriptions.Item>
              <Descriptions.Item label="Total Blog Posts">{stats.totalBlogs}</Descriptions.Item>
              <Descriptions.Item label="Total Messages">{stats.totalMessages}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Settings