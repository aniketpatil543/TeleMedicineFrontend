import { Link } from "react-router-dom";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Replace alert with beautiful toast
    toast.success("Login Successful!", {
      style: {
        borderRadius: "10px",
        background: "#4B0082",
        color: "#fff",
      },
    });
  };

  return (
    <div className="w-full min-h-screen flex font-sans bg-white">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center bg-gradient-to-br from-[#F7F4FF] to-[#E8E3FF] px-10 overflow-hidden">

        {/* Soft Blurs */}
        <div className="absolute top-6 right-10 w-44 h-44 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-12 left-10 w-56 h-56 bg-blue-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <img
            src="/Logo1.png"
            alt="Logo"
            className="w-72 -mb-5 drop-shadow-lg"
          />

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

          <form onSubmit={handleLogin} className="mt-8 space-y-6">

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                className={`w-full border px-4 py-3 rounded-xl focus:ring-2 outline-none ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-purple-400 border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className={`w-full border px-4 py-3 pr-12 rounded-xl focus:ring-2 outline-none ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-purple-400 border-gray-300"
                }`}
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
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 text-white text-lg font-semibold hover:opacity-90 transition-all">
              Login
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
            Don’t have an account?{" "}
            <Link className="text-purple-700 font-semibold hover:underline" to="/signup">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
