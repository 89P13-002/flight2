import { Routes ,Route} from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Homepage from "./components/Homepage/Homepage.jsx";
import Flight from "./components/Flight/Flight.jsx";
import Admin from "./components/Admin/Admin.jsx";
import User from "./components/User/User.jsx";
import Footer from "./components/Footer/Footer.jsx";
import UserProfile from "./components/User/UserProfile.jsx";
import AdminProfile from "./components/Admin/AdminProfile.jsx";
import SearchedFlight from "./components/SearchFlight/SearchFlight.jsx";
import ManageFlight from "./components/Admin/ManageFlight.jsx";
import BookingPage from "./components/Booking/Booking.jsx";



function App() {
  return (
    <div>
      <Header></Header>
      <section>
        <Routes>
          <Route path="/" element={<Homepage></Homepage>} />
          <Route path="/flight" element={<Flight></Flight>} />
          <Route path="/user/login" element={<User isLogin={true} />} />
          <Route path="/user/signup" element={<User isLogin={false} />} />
          <Route path="/admin/signup" element={<Admin isLogin={false} />} />
          <Route path="/admin/login" element={<Admin isLogin={true} />} />
          <Route path="/user/:id" element={<UserProfile></UserProfile>} />
          <Route path="/admin/:id" element={<AdminProfile></AdminProfile>} />
          <Route path="/search/:from/:to/:departureDate/:returnDate/:classType" element={<SearchedFlight></SearchedFlight>} />
          <Route path="/admin/:id/flight" element={<ManageFlight></ManageFlight>} />
          <Route path="/booking/:id" element={<BookingPage></BookingPage>} />
        </Routes>
      </section>
      <Footer></Footer>
    </div>
    
  )
};

export default App;