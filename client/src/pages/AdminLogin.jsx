import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, Alert, Layout } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { AppContext } from '../context/AppContext'
import { authAPI } from '../services/api'

const { Title } = Typography
const { Content } = Layout

const AdminLogin = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { login } = useContext(AppContext)
    const navigate = useNavigate()

    const onFinish = async (values) => {
        setLoading(true)
        setError('')
        try {
            await authAPI.login(values)
            login()
            navigate('/admin')
        } catch (err) {
            setError(err.message || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={2}>Admin Login</Title>
                    </div>
                    
                    {error && (
                        <Alert
                            message={error}
                            type="error"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                    )}
                    
                    <Form
                        name="login"
                        onFinish={onFinish}
                        autoComplete="off"
                        size="large"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Username" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </Layout>
    )
}

export default AdminLogin
