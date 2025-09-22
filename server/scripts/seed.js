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
    image: "https://picsum.photos/800/600?random=1",
    images: [
      "https://picsum.photos/800/600?random=2",
      "https://picsum.photos/800/600?random=3",
      "https://picsum.photos/800/600?random=4"
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
    image: "https://picsum.photos/800/600?random=5",
    images: [
      "https://picsum.photos/800/600?random=6",
      "https://picsum.photos/800/600?random=7"
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
    image: "https://picsum.photos/800/600?random=8",
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
    pricing: {
      basePrice: 12500,
      originalPrice: 16500,
      currency: "INR",
      priceType: "fixed"
    },
    delivery: {
      estimatedDays: 7,
      expressDelivery: false,
      revisions: 5
    },
    features: [
      "3 Initial concepts",
      "Unlimited revisions",
      "Vector files (AI, EPS, SVG)",
      "High-resolution PNG/JPG",
      "Brand guidelines document",
      "Social media kit"
    ],
    category: "Branding",
    media: {
      primaryImage: "https://picsum.photos/600/400?random=9"
    },
    packages: [
      {
        name: "Basic",
        price: 12500,
        features: ["3 concepts", "3 revisions", "Basic files"],
        deliveryTime: "5 days",
        revisions: 3
      },
      {
        name: "Standard",
        price: 20500,
        features: ["5 concepts", "Unlimited revisions", "All file formats", "Brand guidelines"],
        deliveryTime: "7 days",
        revisions: 10,
        popular: true
      },
      {
        name: "Premium",
        price: 33000,
        features: ["10 concepts", "Unlimited revisions", "Complete brand package", "Social media kit", "Business card design"],
        deliveryTime: "10 days",
        revisions: 10
      }
    ],
    status: "active",
    visibility: "featured",
    metrics: {
      rating: 4.9,
      totalOrders: 127,
      reviewCount: 45,
      views: 0
    },
    seo: {
      slug: "logo-design",
      metaTitle: "Professional Logo Design Services - Graphics Thinking",
      metaDescription: "Get a professional logo design that captures your brand essence. 3 concepts, unlimited revisions, all file formats included.",
      keywords: ["logo design", "branding", "business logo", "professional design"]
    }
  },
  {
    name: "Social Media Design",
    description: "Engaging social media graphics that boost your online presence and drive engagement.",
    detailedDescription: "Stand out on social media with professionally designed graphics tailored to each platform's requirements. We create cohesive visual content that aligns with your brand and engages your audience effectively.",
    pricing: {
      basePrice: 6200,
      currency: "INR",
      priceType: "fixed"
    },
    delivery: {
      estimatedDays: 3,
      expressDelivery: true,
      revisions: 3
    },
    features: [
      "Platform-optimized designs",
      "Brand-consistent styling",
      "High-quality graphics",
      "Multiple format options",
      "Quick turnaround"
    ],
    category: "Digital Marketing",
    media: {
      primaryImage: "https://picsum.photos/600/400?random=10"
    },
    packages: [
      {
        name: "Single Post",
        price: 2000,
        features: ["1 social media post", "2 revisions", "All formats"],
        deliveryTime: "1 day",
        revisions: 2
      },
      {
        name: "Weekly Pack",
        price: 6200,
        features: ["7 posts", "Unlimited revisions", "Content calendar"],
        deliveryTime: "3 days",
        revisions: 10,
        popular: true
      },
      {
        name: "Monthly Pack",
        price: 20500,
        features: ["30 posts", "Stories templates", "Highlight covers", "Content strategy"],
        deliveryTime: "7 days",
        revisions: 10
      }
    ],
    status: "active",
    visibility: "public",
    metrics: {
      rating: 4.8,
      totalOrders: 89,
      reviewCount: 32,
      views: 0
    },
    seo: {
      slug: "social-media-design",
      metaTitle: "Social Media Design Services - Graphics Thinking",
      metaDescription: "Professional social media graphics that boost engagement. Platform-optimized designs for Instagram, Facebook, and more.",
      keywords: ["social media design", "instagram posts", "facebook graphics", "social media marketing"]
    }
  },
  {
    name: "Business Card Design",
    description: "Professional business card designs that make a memorable first impression.",
    detailedDescription: "Create a lasting impression with professionally designed business cards. We focus on clean, modern designs that reflect your brand personality while ensuring all important information is clearly presented.",
    pricing: {
      basePrice: 4500,
      originalPrice: 6000,
      currency: "INR",
      priceType: "fixed"
    },
    delivery: {
      estimatedDays: 3,
      expressDelivery: true,
      revisions: 3
    },
    features: [
      "Double-sided design",
      "Print-ready files",
      "Multiple concepts",
      "Premium finishes options",
      "Digital preview"
    ],
    category: "Print Design",
    media: {
      primaryImage: "https://picsum.photos/600/400?random=11"
    },
    status: "active",
    visibility: "public",
    metrics: {
      rating: 4.7,
      totalOrders: 156,
      reviewCount: 67,
      views: 0
    },
    seo: {
      slug: "business-card-design",
      metaTitle: "Business Card Design Services - Graphics Thinking",
      metaDescription: "Professional business card designs that make memorable first impressions. Double-sided, print-ready files included.",
      keywords: ["business card design", "visiting card", "professional cards", "print design"]
    }
  },
  {
    name: "Banner Design",
    description: "Eye-catching banner designs for web, print, and social media advertising.",
    detailedDescription: "Create impactful banners that grab attention and drive action. Whether for digital advertising, trade shows, or promotional campaigns, our banners are designed to maximize your message's impact.",
    pricing: {
      basePrice: 3500,
      currency: "INR",
      priceType: "fixed"
    },
    delivery: {
      estimatedDays: 2,
      expressDelivery: true,
      revisions: 3
    },
    features: [
      "Multiple size formats",
      "Web and print ready",
      "High-resolution output",
      "Brand consistent design",
      "Fast delivery"
    ],
    category: "Digital Marketing",
    media: {
      primaryImage: "https://picsum.photos/600/400?random=12"
    },
    status: "active",
    visibility: "public",
    metrics: {
      rating: 4.6,
      totalOrders: 78,
      reviewCount: 28,
      views: 0
    },
    seo: {
      slug: "banner-design",
      metaTitle: "Banner Design Services - Graphics Thinking",
      metaDescription: "Eye-catching banner designs for web, print, and social media. Multiple formats, fast delivery, brand consistent designs.",
      keywords: ["banner design", "web banners", "advertising banners", "promotional design"]
    }
  }
]

const blogData = [
  {
    title: "10 Essential Design Principles Every Business Owner Should Know",
    slug: "10-essential-design-principles-business-owners",
    excerpt: "Discover the fundamental design principles that can transform your business's visual communication and brand perception.",
    content: "Design is more than just making things look pretty – it's about effective communication, building trust, and creating memorable experiences for your audience. Whether you're a startup founder or an established business owner, understanding these essential design principles can significantly impact your brand's success.\n\nVisual hierarchy guides your audience's eye through your content in order of importance. Use size, color, contrast, and positioning to create a clear path for viewers to follow.\n\nConsistent use of colors, fonts, spacing, and imagery across all your materials builds recognition and trust. Your audience should immediately recognize your brand, whether they're looking at your website, business card, or social media posts.",
    category: "Design Tips",
    image: "https://picsum.photos/800/500?random=11",
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