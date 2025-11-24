import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import PatientRoutes from "./routes/PatientRoutes";
import DoctorRoutes from "./routes/DoctorRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";
import LandingPage from "./pages/Landing/LandingPage";

function App() {

  return (
       <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<PublicRoutes />}>
           <Route path="/" element={<LandingPage></LandingPage>}></Route>
          {/* <Route path="/login" element={<Login />} />
          <Route path="/patient/signup" element={<PatientSignup />} />
          <Route path="/doctor/signup" element={<DoctorSignup />} /> */}
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
