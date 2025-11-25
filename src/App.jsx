import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import PatientRoutes from "./routes/PatientRoutes";
import DoctorRoutes from "./routes/DoctorRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";

import LandingPage from "./pages/Landing/LandingPage";
import Login from "./pages/Auth/Login";

import Signup from "./pages/Auth/Signup/Signup";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Dashboard from "./pages/Patient/Dashboard";


function App() {

  return (
      <Provider store={store}>

         <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<PublicRoutes />}>
           <Route path="/" element={<LandingPage></LandingPage>}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

           
          {/* <Route path="/doctor/signup" element={<DoctorSignup />} />  */}

          <Route path="/patient/dashboard" element={<Dashboard></Dashboard>}></Route>
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
      </Provider>
  )
}

export default App
