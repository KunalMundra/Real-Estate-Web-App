import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Profile from './Pages/Profile';
import Header from './Components/Header';
import Search from './Pages/Search';
import Listing from './Pages/Listing';
import PrivateRoute from './Components/PrivateRoute';
import CreateListing from './Pages/CreateListing';
import UpdateListing from './Pages/UpdateListing';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/About' element={<About />} />
        <Route path='/SignIn' element={<SignIn />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/search' element={<Search />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path='/Profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
