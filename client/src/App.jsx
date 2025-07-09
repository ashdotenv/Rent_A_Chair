import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from './Components/Navbar';
import { useDispatch, useSelector } from "react-redux";
import { toggleLoginStatus } from "./Redux/slice";
import { useMyDetailsQuery } from "./Redux/Service";
import Settings from "./Components/Profile/Settings";
import {
  NotFound,
  Login,
  Register,
  Home,
  Profile,
  Cart,
  Favorites,
  SearchProducts,
  Checkout,
  SingleProduct,
  ResetPassword,
  MyOrders,
  ChangePassword,
  PaymentFaliure,
  PaymentSuccess
} from './Pages/Index';
import PaymentFailure from "./Pages/PaymentFaliure";

function App() {
  const dispatch = useDispatch();
  // Check localStorage and update Redux state
  if (Boolean(localStorage.getItem("loggedIn"))) {
    dispatch(toggleLoginStatus(true));
  }

  const { loggedInStatus } = useSelector(state => state.service);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Conditionally render protected routes based on loggedInStatus */}
        {loggedInStatus ? (
          <>
            <Route path='/resetPassword' element={<ResetPassword />} />
            <Route path='/profile' element={<Profile />} >
              <Route path='se2ttings' element={<Settings />} />
              <Route path='myOrders' element={<MyOrders />} />
            </Route>
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/changePassword' element={<ChangePassword />} />
            <Route path='/paymentFailure' element={<PaymentFailure />} />
            <Route path='/paymentSuccess' element={<PaymentSuccess />} />
          </>
        ) : (
          // Redirect to login page if the user is not logged in for protected routes
          <>
            <Route path='/profile' element={<Navigate to="/login" replace />} />
            <Route path='/resetPassword' element={<Navigate to="/login" replace />} />
            <Route path='/checkout' element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Non-Protected Routes */}
        <Route path='/SearchProducts' element={<SearchProducts />} />
        <Route path='/singleProduct/:id' element={<SingleProduct />} />
        <Route path='/favorites' element={<Favorites />} /> {/* Accessible without login */}
        <Route path='/cart' element={<Cart />} /> {/* Accessible without login */}

        <Route path='*' element={<Navigate to="/login" replace />} /> {/* Redirect all unknown routes to /login */}
      </Routes>
      <Toaster position='top-center' />
    </BrowserRouter>
  );
}

export default App;
