import { Routes, Route } from 'react-router-dom'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import AdminLogin from './pages/AdminLogin'
import PrivateRoute from './components/admin/PrivateRoute'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const PortfolioDetail = lazy(() => import('./pages/PortfolioDetail'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const AdminPanel = lazy(() => import('./pages/AdminPanel'))

const LoadingSpinner = () => (
  <Center h="50vh">
    <Spinner size="xl" color="brand.red" />
  </Center>
)

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Admin routes without navbar/footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<PrivateRoute />}>
          <Route index element={<AdminPanel />} />
        </Route>
        
        {/* Regular routes with navbar/footer */}
        <Route path="/*" element={
          <Box minH="100vh" display="flex" flexDirection="column">
            <ScrollToTop />
            <Navbar />
            <Box flex="1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:id" element={<PortfolioDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        } />
      </Routes>
    </Suspense>
  )
}

export default App