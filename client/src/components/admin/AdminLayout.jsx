import { useState } from 'react'
import { Layout, Menu, Button, Typography } from 'antd'
import {
  DashboardOutlined, FileImageOutlined, AppstoreOutlined, 
  EditOutlined, MessageOutlined, SettingOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const AdminLayout = ({ children, selectedMenu, onMenuSelect, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'portfolio', icon: <FileImageOutlined />, label: 'Portfolio' },
    { key: 'services', icon: <AppstoreOutlined />, label: 'Services' },
    { key: 'blog', icon: <EditOutlined />, label: 'Blog Posts' },
    { key: 'messages', icon: <MessageOutlined />, label: 'Messages' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' }
  ]

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <Layout style={{ height: '100vh' }}>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed} 
          theme="dark"
          style={{
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            zIndex: 100
          }}
        >
          <div style={{ height: 64, margin: 16, background: 'rgba(255, 255, 255, 0.3)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{collapsed ? 'GT' : 'GT Admin'}</Text>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedMenu]}
            onClick={({ key }) => onMenuSelect(key)}
            items={menuItems}
          />
        </Sider>
        
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Header style={{ 
            padding: 0, 
            background: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            paddingRight: 24,
            position: 'fixed',
            top: 0,
            right: 0,
            left: collapsed ? 80 : 200,
            zIndex: 99,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Text strong>Graphics Thinking Admin</Text>
              <Button 
                icon={<LogoutOutlined />} 
                onClick={onLogout}
                type="text"
                danger
              >
                Logout
              </Button>
            </div>
          </Header>
          
          <Content style={{ 
            marginTop: 64,
            padding: '24px 32px', 
            background: '#f0f2f5',
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto'
          }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default AdminLayout