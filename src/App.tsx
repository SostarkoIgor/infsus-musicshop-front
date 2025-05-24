import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProductForm from './pages/productForm'
import MasterDetail from './pages/masterDetail'
import MainLayout from './layouts/MainLayout'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<ProductForm />} />
            <Route path="/order" element={<MasterDetail />} />
            <Route path="/product" element={<ProductForm />} />
            <Route path="/product/:id" element={<ProductForm />} />
            <Route path="/order/:id" element={<MasterDetail />} />
            <Route path="/*" element={<h1>404 Not Found</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
