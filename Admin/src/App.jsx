import { Routes, Route } from "react-router-dom"
import Sidebar from "./Components/Sidebar"
import Products from "./Pages/Products"
function App() {

  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/products" element={<Products />} />
      </Routes>
    </>
  )
}

export default App
