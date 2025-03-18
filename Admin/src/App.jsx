import { Routes, Route } from "react-router-dom";
import Products from "./Pages/Products";
import Sidebar from "./Components/Sidebar"
import Login from "./Pages/Login";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Orders from "./Pages/Orders";
function App() {
  const { loggedInStatus } = useSelector(state => state.service)
  console.log(loggedInStatus);
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Sidebar />}>
          <Route path="products" element={<Products />} />
          <Route path="Orders" element={<Orders />} />
        </Route>
      </Routes>
      <Toaster position='top-center' />
    </>
  );
}

export default App;
