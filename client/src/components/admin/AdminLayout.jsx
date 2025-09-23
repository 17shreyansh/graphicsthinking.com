import { useState, useEffect, useContext } from 'react'
import { Layout, Menu, Button, Typography, message } from 'antd'
import { 
  DashboardOutlined, 
  ProjectOutlined, 
  CustomerServiceOutlined, 
  MessageOutlined,
  PictureOutlined,
  LogoutOutlined 
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { authAPI } from '../../services/api'
import Dashboard from './Dashboard'
import Portfolio from './Portfolio'
import Services from './Services'
import Messages from './Messages'
import ImageManager from './ImageManager'

const { Header, Sider, Content } = Layout
const { Title } = Typography

export default function AdminLayout() {
  const [selectedKey, setSelectedKey] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const { isAuthenticated, logout } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, navigate])

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      logout()
      message.success('Logged out successfully')
      navigate('/admin/login')
    } catch (error) {
      message.error('Logout failed')
    }
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
      key: 'images',
      icon: <PictureOutlined />,
      label: 'Images'
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
      case 'images':
        return <ImageManager />
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