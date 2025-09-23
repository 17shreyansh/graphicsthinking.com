# Graphics Thinking - Professional Portfolio Website

A modern, professional portfolio website for graphic design services built with React, Node.js, and MongoDB.

## 🚀 Features

- **Modern Design**: Clean, professional UI with Chakra UI components
- **Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **Dynamic CMS**: Admin panel to manage portfolio, services, and blog posts
- **Contact System**: Contact form with email notifications
- **SEO Ready**: Optimized for search engines
- **Fast Performance**: Built with Vite for optimal loading speeds

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- Chakra UI for components
- Framer Motion for animations
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Nodemailer for email functionality
- Multer for file uploads

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd graphicsthinking.com
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # In server directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas cloud service

5. **Run the application**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🎨 Design System

### Colors
- **Primary Red**: #E53E3E
- **Primary Blue**: #3182CE  
- **Primary Brown**: #8B4513

### Typography
- **Headings**: Anton (bold, impactful)
- **Body**: Poppins (clean, readable)
- **Accent**: Montserrat (professional)

## 📱 Pages

- **Home**: Hero section, featured work, call-to-actions
- **About**: Company story, team, philosophy
- **Portfolio**: Filterable gallery of work
- **Services**: Service offerings with pricing

- **Contact**: Contact form and information
- **Admin**: Content management panel

## 🔧 Admin Panel

Access the admin panel at `/admin` to manage:
- Portfolio items
- Services and pricing
- Image uploads
- Contact messages

## 📧 Email Configuration

Configure email settings in `.env`:
```env
EMAIL_USER=devsaxena285@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=devsaxena285@gmail.com
```

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
# Configure environment variables
# Deploy to your preferred platform
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support, email devsaxena285@gmail.com or create an issue in the repository.