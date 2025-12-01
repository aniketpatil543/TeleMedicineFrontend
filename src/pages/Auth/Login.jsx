import { Link } from "react-router-dom";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PERSIST_STORE_NAME } from "../../constants/constants";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
export default function Login() {
  const [form, setForm] = useState({ emailId: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setApiError(""); // Clear API errors when user types

    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!form.emailId.trim()) {
      newErrors.emailId = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.emailId)) {
      newErrors.emailId = "Invalid email format";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleLogin = async (e) => {
  e.preventDefault();
  setApiError("");
  
  if (!validate()) return;

  setIsLoading(true);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/signin`,
      {
        emailId: form.emailId,
        password: form.password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const userData = await response.data;

    console.log('userData',userData)
    // Update Redux store
   // Determine profile (doctor or patient)
let profile = null;

if (userData.doctorProfile) {
  profile = {
    id: userData.doctorProfile.doctorId,
    firstName: userData.doctorProfile.firstName,
    lastName: userData.doctorProfile.lastName,
    phone: userData.doctorProfile.phone,
    department: userData.doctorProfile.department,
    specialization: userData.doctorProfile.specialization,
    experience: userData.doctorProfile.experience
  };
} else if (userData.patientProfile) {
  profile = {
    id: userData.userId,
    firstName: userData.patientProfile.name,
    phone: userData.patientProfile.phone,
    age: userData.patientProfile.age,
    gender: userData.patientProfile.gender
  };
}

// Now build Redux user object
const userAuthData = {
  emailId: userData.emailId,
  token: userData.jwtToken,
  role: userData.roles || userData.role,
  user: profile,  // ⭐ Finally storing doctor or patient data here
};


    dispatch(loginSuccess(userAuthData));
    
    // Store user data in localStorage
    localStorage.setItem(PERSIST_STORE_NAME, JSON.stringify(userData));
    localStorage.setItem('authToken', userData.token || userData.accessToken);
    

    // Parse JWT token to get roles
    const token = userData.token || userData.accessToken;
    if (token) {
      const decodedToken = parseJwt(token);
      console.log('Decoded token:', decodedToken);
      
      // Use roles from decoded JWT token
      const userRoles = decodedToken.roles || decodedToken.role;
      redirectBasedOnRole(userRoles);
    } else {
      // Fallback to userData roles if no token
      redirectBasedOnRole(userData.roles || userData.role);
    }

  } catch (error) {
    console.error("Login error:", error);
    // ... existing error handling code ...
  } finally {
    setIsLoading(false);
  }
};


const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return {};
  }
};

const redirectBasedOnRole = (roles) => {
  const userRoles = Array.isArray(roles) ? roles : [roles];
  
  
  if (userRoles.includes("PATIENT")) {
    navigate("/patient/dashboard");
  } else if (userRoles.includes("DOCTOR")) {
    navigate("/doctor/dashboard");
  } else if (userRoles.includes("ADMIN")) {
    navigate("/admin/dashboard");
  } else {
    // Default fallback
    navigate("/dashboard");
  }
};

  // Check if user is already logged in (optional - for auto-redirect)
  // useEffect(() => {
  //   const storedUser = localStorage.getItem('userData');
  //   if (storedUser) {
  //     const userData = JSON.parse(storedUser);
  //     redirectBasedOnRole(userData.roles || userData.role);
  //   }
  // }, []);

  return (
    <div className="w-full min-h-screen flex font-sans bg-white">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center bg-gradient-to-br from-[#F7F4FF] to-[#E8E3FF] px-10 overflow-hidden">
        {/* Accent Soft Blurs */}
        <div className="absolute top-6 right-10 w-44 h-44 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-12 left-10 w-56 h-56 bg-blue-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <img
            src="/Logo1.png"
            alt="Logo"
            className="w-72 -mb-5 drop-shadow-lg"
          />

          {/* Heading */}
          <h2 className="text-4xl font-semibold text-gray-900 text-center -mt-4 leading-tight">
            Welcome Back
          </h2>

          <p className="text-gray-600 text-lg mt-2 text-center max-w-md">
            Access your secure telemedicine dashboard anytime, anywhere.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="bg-white p-10 w-full max-w-md rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-4xl font-bold text-center text-[#4B0082] tracking-tight">
            Login
          </h2>
          <p className="text-gray-500 text-center mt-2">
            Continue to Telemedicine Portal
          </p>

          {/* API Error Message */}
          {apiError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {apiError}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {/* Email */}
            <div>
              <input
                type="email"
                name="emailId"
                placeholder="Email Address"
                value={form.emailId}
                onChange={handleChange}
                className={`w-full border px-4 py-3 rounded-xl focus:ring-2 outline-none ${
                  errors.emailId ? "border-red-500 focus:ring-red-400" : "focus:ring-purple-400 border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.emailId && (
                <p className="text-red-500 text-sm mt-1">{errors.emailId}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`w-full border px-4 py-3 pr-12 rounded-xl focus:ring-2 outline-none ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-purple-400 border-gray-300"
                }`}
                disabled={isLoading}
              />

              {/* Eye Icon */}
              <span
                className="absolute right-4 top-3 text-xl cursor-pointer text-gray-500"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <p className="text-right text-sm text-purple-700 hover:underline cursor-pointer m-0">
              Forgot Password?
            </p>

            {/* Login Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 text-white text-lg font-semibold hover:opacity-90 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t"></div>
            <span className="text-gray-500">or</span>
            <div className="flex-1 border-t"></div>
          </div>

          {/* Signup Redirect */}
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link 
              className="text-purple-700 font-semibold hover:underline" 
              to="/signup"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}