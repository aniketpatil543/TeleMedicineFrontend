import { Link } from "react-router-dom";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { sendOtp, verifyOtp,onboardingEmail } from "../../../services/emailService";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    roles: ["PATIENT"]
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate=useNavigate();
  
  // OTP Verification States
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");

  const goToLogin=()=>{
    navigate("/login")
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    if (otpError) setOtpError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!formData.emailId.trim())
      newErrors.emailId = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.emailId))
      newErrors.emailId = "Invalid email format";

    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    // OTP verification check
    if (!isOtpVerified)
      newErrors.otp = "Please verify your email with OTP";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    // Validate email first
    if (!formData.emailId.trim()) {
      setErrors(prev => ({ ...prev, emailId: "Email is required to send OTP" }));
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
      setErrors(prev => ({ ...prev, emailId: "Invalid email format" }));
      return;
    }

    setIsSendingOtp(true);
    setOtpError("");

    try {
      await sendOtp(formData.emailId);
      setIsOtpSent(true);
      setOtpError("");
      alert("OTP sent to your email successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOtpError("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("Please enter OTP");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      await verifyOtp(formData.emailId, otp);
      setIsOtpVerified(true);
      setOtpError("");
      alert("Email verified successfully!");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setIsSendingOtp(true);
    setOtpError("");

    try {
      await sendOtp(formData.emailId);
      setOtp(""); // Clear previous OTP
      setIsOtpVerified(false);
      setOtpError("");
      alert("New OTP sent to your email!");
    } catch (error) {
      console.error("Error resending OTP:", error);
      setOtpError("Failed to resend OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!isOtpVerified) {
      setOtpError("Please verify your email with OTP before registering");
      return;
    }

    try {
      const url=`${import.meta.env.VITE_API_URL}/signup`
      const url2="http://localhost:8081/auth/signup";

      const response = await axios.post(url, {
        "emailId": formData.emailId,
        "roles": formData.roles,
        "password": formData.password,
        "firstName": formData.firstName,
        "lastName": formData.lastName
      });
      
      const data = await response.data;
      console.log("DATA ==> " + data);
      alert("Account Created Successfully!");
      
      await onboardingEmail(formData.emailId,"Welcome to TeleMedicine")
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        confirmPassword: "",
        roles: ["PATIENT"]
      });
      setOtp("");
      setIsOtpSent(false);
      setIsOtpVerified(false);

      goToLogin();
      
      
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen flex font-sans bg-white">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 h-screen relative flex-col items-center justify-center bg-gradient-to-br from-[#c5b3f5] to-[#E8E3FF] px-10 overflow-hidden shadow-inner">
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
              <div className="flex gap-2">
                <input
                  name="emailId"
                  placeholder="Email Address"
                  value={formData.emailId}
                  onChange={handleChange}
                  className="flex-1 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  disabled={isOtpVerified} // Disable email after verification
                />
                <button
                  type="button"
                  onClick={isOtpSent ? handleResendOtp : handleSendOtp}
                  disabled={isSendingOtp || isOtpVerified}
                  className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSendingOtp ? "Sending..." : isOtpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
              {errors.emailId && <p className="text-red-500 text-sm">{errors.emailId}</p>}
            </div>

            {/* OTP Verification Section */}
            {isOtpSent && !isOtpVerified && (
              <div className="space-y-3 p-4 border border-purple-200 rounded-xl bg-purple-50">
                <label className="text-sm font-medium text-purple-800">
                  Enter OTP sent to your email
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    className="flex-1 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp}
                    className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify"}
                  </button>
                </div>
                {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
              </div>
            )}

            {isOtpVerified && (
              <div className="p-3 bg-green-100 border border-green-400 rounded-xl text-green-700 text-sm flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                Email verified successfully!
              </div>
            )}

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

            <button 
              type="submit"
              disabled={!isOtpVerified}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 text-white text-lg font-semibold hover:opacity-90 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
            >
              {isOtpVerified ? "Sign Up" : "Verify Email to Continue"}
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