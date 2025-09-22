import { useState, useEffect } from 'react'
import { Layout, Menu, Button, Typography, Space } from 'antd'
import { 
  DashboardOutlined, 
  ProjectOutlined, 
  CustomerServiceOutlined, 
  MessageOutlined,
  LogoutOutlined 
} from '@ant-design/icons'
import Dashboard from './Dashboard'
import Portfolio from './Portfolio'
import Services from './Services'
import Messages from './Messages'
import AdminAuthPerfect from '../AdminAuthPerfect'

const { Header, Sider, Content } = Layout
const { Title } = Typography

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedKey, setSelectedKey] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth')
    setIsAuthenticated(authStatus === 'true')
  }, [])

  const handleLogin = () => setIsAuthenticated(true)

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <AdminAuthPerfect onLogin={handleLogin} />
  }

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: 'portfolio',
      icon: <ProjectOutlined />,
      label: 'Portfolio'
    },
    {
      key: 'services',
      icon: <CustomerServiceOutlined />,
      label: 'Services'
    },
    {
      key: 'messages',
      icon: <MessageOutlined />,
      label: 'Messages'
    }
  ]

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />
      case 'portfolio':
        return <Portfolio />
      case 'services':
        return <Services />
      case 'messages':
        return <Messages />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="dark"
      >
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {collapsed ? 'GT' : 'Graphics Thinking'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Title level={4} style={{ margin: 0, textTransform: 'capitalize' }}>
            {selectedKey}
          </Title>
          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Header>
        
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#fff',
          borderRadius: 6
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  )
}