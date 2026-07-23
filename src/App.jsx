import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginModal from './components/LoginModal'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import OrderStatusUpdate from './pages/OrderStatusUpdate'
import AnnouncementBar from "./components/AnnouncementBar";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">

      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Navbar */}
      <Navbar />

      {/* Pages */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-status-update" element={<OrderStatusUpdate />} />
        </Routes>
      </main>

      {/* Login Modal */}
      <LoginModal />

      {/* Footer */}
      <Footer />

    </div>
    
  )
}