import { Link } from "react-router-dom";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    roles:["PATIENT"]
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!formData.emailId.trim())
      newErrors.emailId = "emailId is required";
    else if (!/\S+@\S+\.\S+/.test(formData.emailId))
      newErrors.emailId = "Invalid emailId format";

    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {

       const response = await axios.post(`${import.meta.env.VITE_API_URL}/signup`,{
        "emailId" :formData.emailId ,
        "roles":formData.roles ,
        "password":formData.password
       }) ;
       const data = await response.data ;


       console.log("DATA ==> " +  data);
       
        
      alert("Account Created Successfully!");
    }
  };


  return (
    <div className="w-full h-screen flex font-sans bg-white">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 h-screen relative flex-col items-center justify-center bg-gradient-to-br from-[#c5b3f5] to-[#E8E3FF] px-10 overflow-hidden shadow-inner l">

        <img 
          src="/Logo1.png"
          className="w-72 -mb-5 drop-shadow-lg py-0"
          alt="Platform Logo"
        />

        <h2 className="text-4xl font-semibold text-gray-900 text-center leading-snug">
          Transforming Healthcare,<br /> One Click at a Time
        </h2>

        <p className="text-gray-600 text-lg mt-4 text-center max-w-md">
          Secure telemedicine access with certified doctors — anytime, anywhere.
        </p>

        {/* Highlights */}
        <div className="mt-10 space-y-4 text-gray-800 text-lg font-medium">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-purple-600 text-xl" /> Online Prescriptions
          </div>
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-purple-600 text-xl" /> 24/7 Doctor Availability
          </div>
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-purple-600 text-xl" /> Secure Health Records
          </div>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl border border-gray-100">

          <h2 className="text-4xl font-bold text-center text-[#4B0082] tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-500 text-center mt-2">
            Sign up to continue into platform
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            
            <div className="flex gap-4">
              <div className="w-1/2">
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              </div>

              <div className="w-1/2">
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <input
                name="emailId"
                placeholder="emailId Address"
                value={formData.emailId}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
              {errors.emailId && <p className="text-red-500 text-sm">{errors.emailId}</p>}
            </div>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 pr-12 focus:outline-none"
              />
              <span 
                className="absolute right-3 top-3 text-xl cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 pr-12 focus:outline-none"
              />
              <span 
                className="absolute right-3 top-3 text-xl cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 text-white text-lg font-semibold hover:opacity-90 transition-all">
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link className="text-purple-700 font-semibold hover:underline" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
