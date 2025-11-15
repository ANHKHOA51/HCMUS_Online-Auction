import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductDetail from './pages/ProductDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/product/:id" element={<ProductDetail />} />
        {/* Thêm các route khác ở đây */}
      </Routes>
    </Router>
  )
}

export default App
