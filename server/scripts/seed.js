const mongoose = require('mongoose')
require('dotenv').config()

const Portfolio = require('../models/Portfolio')
const Service = require('../models/Service')
const Blog = require('../models/Blog')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/graphicsthinking')
    console.log('MongoDB Connected')
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}

const portfolioData = [
  {
    title: "Modern Brand Identity Design",
    description: "Complete brand identity package for a tech startup including logo, business cards, and brand guidelines.",
    detailedDescription: "This comprehensive brand identity project involved creating a modern, tech-forward visual identity for an innovative startup. The project included extensive research into the target market, competitor analysis, and multiple design iterations to achieve the perfect balance of professionalism and innovation.",
    category: "Logos",
    image: "https://via.placeholder.com/800x600/E53E3E/FFFFFF?text=Brand+Identity",
    images: [
      "https://via.placeholder.com/800x600/E53E3E/FFFFFF?text=Logo+Design",
      "https://via.placeholder.com/800x600/3182CE/FFFFFF?text=Business+Cards",
      "https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Brand+Guidelines"
    ],
    tags: ["branding", "logo", "identity", "startup"],
    client: "TechFlow Solutions",
    projectDate: new Date('2024-01-15'),
    projectUrl: "https://techflow.example.com",
    technologies: ["Adobe Illustrator", "Photoshop", "InDesign"],
    featured: true,
    views: 245,
    likes: 18
  },
  {
    title: "Social Media Campaign Design",
    description: "Instagram and Facebook post series for a fashion brand's summer collection launch.",
    detailedDescription: "A vibrant social media campaign designed to showcase the summer collection with consistent visual storytelling across multiple platforms. The design focused on bright, energetic colors and lifestyle photography integration.",
    category: "Social Media",
    image: "https://via.placeholder.com/800x600/3182CE/FFFFFF?text=Social+Media",
    images: [
      "https://via.placeholder.com/800x600/3182CE/FFFFFF?text=Instagram+Posts",
      "https://via.placeholder.com/800x600/E53E3E/FFFFFF?text=Facebook+Ads"
    ],
    tags: ["social media", "fashion", "campaign", "instagram"],
    client: "Summer Styles Co.",
    projectDate: new Date('2024-02-20'),
    technologies: ["Canva Pro", "Photoshop", "Figma"],
    featured: false,
    views: 189,
    likes: 12
  },
  {
    title: "Event Poster Design",
    description: "Eye-catching poster design for a music festival with bold typography and vibrant colors.",
    detailedDescription: "This music festival poster required a design that would stand out in both digital and print formats. The challenge was creating a design that captured the energy of live music while maintaining readability and brand consistency.",
    category: "Posters",
    image: "https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Event+Poster",
    tags: ["poster", "event", "music", "festival"],
    client: "City Music Festival",
    projectDate: new Date('2024-03-10'),
    technologies: ["Adobe Illustrator", "Photoshop"],
    featured: true,
    views: 156,
    likes: 9
  }
]

const serviceData = [
  {
    name: "Logo Design",
    description: "Professional logo design that captures your brand's essence and makes a lasting impression.",
    detailedDescription: "Our logo design process involves deep research into your industry, target audience, and brand values. We create multiple concepts, refine based on your feedback, and deliver a logo that truly represents your business. Each logo comes with brand guidelines and multiple file formats for various applications.",
    price: 12500,
    originalPrice: 16500,
    features: [
      "3 Initial concepts",
      "Unlimited revisions",
      "Vector files (AI, EPS, SVG)",
      "High-resolution PNG/JPG",
      "Brand guidelines document",
      "Social media kit"
    ],
    deliveryTime: "5-7 days",
    revisions: 5,
    category: "Branding",
    image: "https://via.placeholder.com/600x400/E53E3E/FFFFFF?text=Logo+Design",
    packages: [
      {
        name: "Basic",
        price: 12500,
        features: ["3 concepts", "3 revisions", "Basic files"],
        deliveryTime: "5 days"
      },
      {
        name: "Standard",
        price: 20500,
        features: ["5 concepts", "Unlimited revisions", "All file formats", "Brand guidelines"],
        deliveryTime: "7 days"
      },
      {
        name: "Premium",
        price: 33000,
        features: ["10 concepts", "Unlimited revisions", "Complete brand package", "Social media kit", "Business card design"],
        deliveryTime: "10 days"
      }
    ],
    active: true,
    popular: true,
    rating: 4.9,
    totalOrders: 127
  },
  {
    name: "Social Media Design",
    description: "Engaging social media graphics that boost your online presence and drive engagement.",
    detailedDescription: "Stand out on social media with professionally designed graphics tailored to each platform's requirements. We create cohesive visual content that aligns with your brand and engages your audience effectively.",
    price: 6200,
    features: [
      "Platform-optimized designs",
      "Brand-consistent styling",
      "High-quality graphics",
      "Multiple format options",
      "Quick turnaround"
    ],
    deliveryTime: "2-3 days",
    revisions: 3,
    category: "Digital Marketing",
    image: "https://via.placeholder.com/600x400/3182CE/FFFFFF?text=Social+Media",
    packages: [
      {
        name: "Single Post",
        price: 2000,
        features: ["1 social media post", "2 revisions", "All formats"],
        deliveryTime: "1 day"
      },
      {
        name: "Weekly Pack",
        price: 6200,
        features: ["7 posts", "Unlimited revisions", "Content calendar"],
        deliveryTime: "3 days"
      },
      {
        name: "Monthly Pack",
        price: 20500,
        features: ["30 posts", "Stories templates", "Highlight covers", "Content strategy"],
        deliveryTime: "7 days"
      }
    ],
    active: true,
    popular: false,
    rating: 4.8,
    totalOrders: 89
  }
]

const blogData = [
  {
    title: "10 Essential Design Principles Every Business Owner Should Know",
    slug: "10-essential-design-principles-business-owners",
    excerpt: "Discover the fundamental design principles that can transform your business's visual communication and brand perception.",
    content: "Design is more than just making things look pretty – it's about effective communication, building trust, and creating memorable experiences for your audience. Whether you're a startup founder or an established business owner, understanding these essential design principles can significantly impact your brand's success.\n\nVisual hierarchy guides your audience's eye through your content in order of importance. Use size, color, contrast, and positioning to create a clear path for viewers to follow.\n\nConsistent use of colors, fonts, spacing, and imagery across all your materials builds recognition and trust. Your audience should immediately recognize your brand, whether they're looking at your website, business card, or social media posts.",
    category: "Design Tips",
    image: "https://via.placeholder.com/800x500/E53E3E/FFFFFF?text=Design+Principles",
    tags: ["design", "business", "branding", "tips"],
    author: "Graphics Thinking Team",
    readTime: 8,
    views: 342,
    likes: 28,
    featured: true,
    published: true,
    publishedAt: new Date('2024-01-20')
  }
]

const seedDatabase = async () => {
  try {
    await connectDB()
    
    await Portfolio.deleteMany({})
    await Service.deleteMany({})
    await Blog.deleteMany({})
    
    await Portfolio.insertMany(portfolioData)
    await Service.insertMany(serviceData)
    await Blog.insertMany(blogData)
    
    console.log('Database seeded successfully!')
    console.log(`Inserted ${portfolioData.length} portfolio items`)
    console.log(`Inserted ${serviceData.length} services`)
    console.log(`Inserted ${blogData.length} blog posts`)
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()