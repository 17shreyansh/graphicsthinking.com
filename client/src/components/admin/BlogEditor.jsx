import { useState, useEffect } from 'react'
import { Form, Input, Select, Switch, Button, Card, message } from 'antd'
import EditorJSComponent from '../EditorJS'
import { ArrowLeftOutlined } from '@ant-design/icons'

const { TextArea } = Input

const BlogEditor = ({ blog, onSave, onCancel, loading }) => {
  const [form] = Form.useForm()
  const [content, setContent] = useState({ blocks: [] })

  useEffect(() => {
    if (blog) {
      form.setFieldsValue(blog)
      setContent(typeof blog.content === 'object' ? blog.content : { blocks: [] })
    }
  }, [blog, form])

  const handleSubmit = (values) => {
    const data = {
      ...values,
      content: content
    }
    onSave(data)
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
          Back to Blog List
        </Button>
      </div>

      <Card title={blog ? 'Edit Blog Post' : 'Create New Blog Post'}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter blog title" />
          </Form.Item>

          <Form.Item name="excerpt" label="Excerpt" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Brief description of the blog post" />
          </Form.Item>

          <Form.Item label="Content" rules={[{ required: true }]}>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, minHeight: 300 }}>
              <EditorJSComponent 
                data={content ? (typeof content === 'string' ? { blocks: [] } : content) : { blocks: [] }}
                onChange={setContent}
                placeholder="Start writing your blog post..."
              />
            </div>
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input placeholder="e.g., Design Tips, Tutorials" />
          </Form.Item>

          <Form.Item name="author" label="Author">
            <Input placeholder="Graphics Thinking" />
          </Form.Item>

          <Form.Item name="image" label="Featured Image URL">
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item name="published" label="Published" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              {blog ? 'Update' : 'Create'} Blog Post
            </Button>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default BlogEditor