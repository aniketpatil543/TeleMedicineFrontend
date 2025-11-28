import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import PatientRoutes from "./routes/PatientRoutes";
import DoctorRoutes from "./routes/DoctorRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";
import LandingPage from "./pages/Landing/LandingPage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup/Signup";
import Dashboard from "./pages/Patient/Dashboard";
import DocDashboard from "./pages/Doctor/DoctorDashboard";
import { useSelector } from "react-redux";

function App() {
  // Accessing auth state from Redux store
  const state = useSelector((state) => state.auth);
  console.log("Auth State in App.jsx:", state);

  return (
      

         <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<PublicRoutes />}>
           <Route path="/" element={<LandingPage></LandingPage>}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

           
          {/* <Route path="/doctor/signup" element={<DoctorSignup />} />  */}
            <Route path="/patient/dashboard" element={<  Dashboard/>} />
          <Route path="/doctor/dashboard" element={<DocDashboard />} />
        </Route>

        {/* LOGGED-IN USERS (ANY ROLE) */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route> */}

        {/* PATIENT ROUTES */}
        {/* <Route element={<PatientRoutes />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
        </Route> */}

        {/* DOCTOR ROUTES */}
        {/* <Route element={<DoctorRoutes />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        </Route> */}

      </Routes>
    </BrowserRouter>
      
  )
}

export default App
