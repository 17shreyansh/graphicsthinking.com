# Graphics Thinking - Professional Admin Panel

A comprehensive admin panel built with **Ant Design** and **EditorJS** for managing the Graphics Thinking portfolio website.

## 🚀 Features

### ✨ Modern UI/UX
- **Ant Design Components**: Professional, responsive interface
- **Dark Theme**: Modern admin panel design
- **Responsive Layout**: Works on all devices
- **Intuitive Navigation**: Easy-to-use sidebar menu

### 📝 Content Management
- **Portfolio Management**: Add, edit, delete portfolio items
- **Services Management**: Manage service offerings
- **Blog Management**: Rich text editor with EditorJS
- **Message Management**: Handle contact form submissions

### 🖼️ Image Management
- **File Upload**: Drag & drop image uploads
- **Image Preview**: Instant preview of uploaded images
- **File Management**: Delete and manage uploaded files
- **Multiple Formats**: Support for JPG, PNG, GIF, WebP

### 📊 Dashboard
- **Statistics Overview**: Quick stats on all content
- **Recent Activity**: Latest portfolio items and messages
- **Visual Cards**: Clean, informative dashboard cards

### 🔐 Security
- **Authentication**: Simple login system
- **Session Management**: Persistent login sessions
- **Protected Routes**: Secure admin access

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **Ant Design 5**: Professional UI components
- **EditorJS**: Rich text editor for blogs
- **Axios**: API communication

### Backend
- **Node.js + Express**: RESTful API
- **Multer**: File upload handling
- **MongoDB**: Database storage
- **Image Processing**: Automatic image optimization

## 📦 Installation

### Quick Start
```bash
# Run the installation script
install-admin.bat
```

### Manual Installation
```bash
# Install client dependencies
cd client
npm install @editorjs/editorjs @editorjs/header @editorjs/list @editorjs/paragraph @editorjs/image @editorjs/quote @editorjs/code

# Start the development server
cd ..
npm run dev
```

## 🔑 Access

### Admin Panel URL
```
http://localhost:3000/admin
```

### Default Credentials
- **Username**: `admin`
- **Password**: `graphics2024`

## 📱 Admin Panel Sections

### 1. Dashboard
- Overview statistics
- Recent portfolio items
- New messages alerts
- Quick navigation cards

### 2. Portfolio Management
- **Add Portfolio Items**: Title, description, category, client, images
- **Edit Existing Items**: Update any portfolio details
- **Featured Items**: Mark items as featured
- **Category Management**: Organize by categories
- **Image Upload**: Direct image upload with preview

### 3. Services Management
- **Service Details**: Name, description, category
- **Delivery Time**: Set expected delivery times
- **Service Images**: Upload service preview images
- **Pricing Information**: Manage service pricing

### 4. Blog Management
- **Rich Text Editor**: EditorJS with multiple block types
  - Headers (H1-H4)
  - Paragraphs with formatting
  - Lists (ordered/unordered)
  - Images with captions
  - Quotes with attribution
  - Code blocks
- **Blog Metadata**: Title, excerpt, category, author
- **Publishing**: Draft/Published status
- **Featured Images**: Upload blog cover images
- **SEO Ready**: Meta titles and descriptions

### 5. Message Management
- **Contact Messages**: View all contact form submissions
- **Status Management**: New, Read, Replied status
- **Reply System**: Send replies directly from admin
- **Message Details**: Full message thread view

## 🎨 EditorJS Features

### Supported Block Types
- **Header**: Multiple heading levels
- **Paragraph**: Rich text with inline formatting
- **List**: Ordered and unordered lists
- **Image**: Upload images with captions
- **Quote**: Blockquotes with attribution
- **Code**: Syntax-highlighted code blocks

### Image Upload
- **Drag & Drop**: Easy image insertion
- **Auto Upload**: Automatic server upload
- **Caption Support**: Add image descriptions
- **Responsive**: Mobile-friendly image handling

## 🔧 Configuration

### Environment Variables
```env
# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/graphicsthinking

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5MB
```

### Upload Settings
- **Max File Size**: 5MB per image
- **Supported Formats**: JPG, PNG, GIF, WebP
- **Storage**: Local file system (configurable)
- **Path**: `/uploads` directory

## 📊 API Endpoints

### Portfolio
- `GET /api/portfolio` - Get all portfolio items
- `POST /api/portfolio` - Create new portfolio item
- `PUT /api/portfolio/:id` - Update portfolio item
- `DELETE /api/portfolio/:id` - Delete portfolio item

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Blog
- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create new blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `DELETE /api/upload/image/:filename` - Delete image

### Messages
- `GET /api/contact` - Get all messages
- `PUT /api/contact/:id` - Update message status
- `DELETE /api/contact/:id` - Delete message

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd client
npm run build
# Deploy dist folder
```

### Backend (Heroku/Railway)
```bash
cd server
# Set environment variables
# Deploy to platform
```

## 🔒 Security Notes

### Production Setup
1. **Change Default Credentials**: Update admin username/password
2. **JWT Authentication**: Implement proper JWT tokens
3. **Rate Limiting**: Add API rate limiting
4. **HTTPS**: Use SSL certificates
5. **Environment Variables**: Secure sensitive data

### File Upload Security
- **File Type Validation**: Only allow image files
- **Size Limits**: Prevent large file uploads
- **Virus Scanning**: Add malware protection
- **Storage Security**: Secure file storage

## 🎯 Usage Tips

### Content Management
1. **Portfolio**: Add high-quality images and detailed descriptions
2. **Services**: Include clear pricing and delivery information
3. **Blog**: Use rich formatting for engaging content
4. **Images**: Optimize images before upload for better performance

### SEO Optimization
1. **Blog Posts**: Add meta titles and descriptions
2. **Images**: Use descriptive alt text
3. **Categories**: Organize content with relevant categories
4. **URLs**: Use SEO-friendly slugs

## 🆘 Troubleshooting

### Common Issues
1. **Upload Fails**: Check file size and format
2. **Login Issues**: Verify credentials and clear browser cache
3. **Editor Problems**: Refresh page and try again
4. **API Errors**: Check server logs and database connection

### Support
- **Email**: hello@graphicsthinking.com
- **Documentation**: Check README files
- **Logs**: Check browser console and server logs

## 📈 Future Enhancements

### Planned Features
- **User Roles**: Multiple admin levels
- **Analytics**: Content performance tracking
- **Backup System**: Automated data backups
- **Multi-language**: International content support
- **Advanced SEO**: Enhanced SEO tools
- **Social Media**: Direct social media posting

---

**Graphics Thinking Admin Panel** - Professional content management made simple.