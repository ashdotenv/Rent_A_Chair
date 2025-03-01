import { BrowserRouter, Route, Routes } from "react-router-dom"
import NotFound from './Pages/NotFound'
import Login from './Pages/Login'
import Register from './Pages/Register'
import { Toaster } from "react-hot-toast"
import Home from './Pages/Home'
import Navbar from './Components/Navbar'
import Profile from './Pages/Profile'
import Cart from './Pages/Cart'
import Favorites from './Pages/Favorites'
import SearchProducts from './Pages/SearchProducts'
import Checkout from './Pages/Checkout'
import SingleProduct from './Pages/SingleProduct'
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/SearchProducts' element={<SearchProducts />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/singleProduct/:id' element={<SingleProduct />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Toaster position='top-center' />
      </BrowserRouter>
    </>
  )
}

export default App
