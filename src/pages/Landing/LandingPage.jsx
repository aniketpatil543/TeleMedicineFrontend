import { useState } from "react";
import { MdVideoCall, MdNotificationsActive, MdEmail, MdSecurity, MdVerifiedUser } from "react-icons/md";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaAward, FaUserMd, FaShieldAlt, FaMapMarkerAlt, FaPrescription } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { BsChatDotsFill, BsCalendar2CheckFill } from "react-icons/bs";
import { IoFitnessSharp } from "react-icons/io5";
import banner from "../../assets/bannerimg.jpg";
import { useNavigate } from "react-router-dom";


export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate=useNavigate();


const goToLogin = () => {
  window.location.href = "/login";
};

const goToSignup = () => {
  window.location.href = "/signup";
};


  return (
    <div className="font-sans bg-white scroll-smooth min-h-screen">

      {/* NAVBAR - Professional & Clean */}
      <header className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className=" h-12 rounded-lg flex items-center justify-center">
              {/* <span className="text-white text-xl font-bold">M</span> */}
              <img 
               className="w-56 h-44"
              src="./Logo1.png">
              </img>
            </div>
            {/* <div>
              <h1 className="text-xl font-bold text-gray-900">MedicConsult</h1>
              <p className="text-xs text-gray-500">Professional Healthcare</p>
            </div> */}
          </div>

          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a href="#home" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#doctors" className="hover:text-blue-600 transition-colors">Our Doctors</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
           
            <a
              href="#login"
              onClick={goToLogin}
              className="bg-[#a931d1]  text-white px-6 py-2.5 rounded-lg hover:bg-[#9939b9] transition-all font-medium"
            >
              Login
            </a>
             <a
              href="#login"
              className="bg-white text-black border border-purple-700 px-6 py-2.5 rounded-lg hover:bg-[#9225b7] hover:text-white transition-all font-medium"
              onClick={goToSignup}
            >
              SignUp
            </a>
          </div>

          <button className="md:hidden text-2xl text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg p-6 space-y-4 border-t border-gray-200">
            <a href="#home" className="block hover:text-blue-600 py-2 font-medium">Home</a>
            <a href="#about" className="block hover:text-blue-600 py-2 font-medium">About</a>
            <a href="#services" className="block hover:text-blue-600 py-2 font-medium">Services</a>
            <a href="#doctors" className="block hover:text-blue-600 py-2 font-medium">Our Doctors</a>
            <a href="#contact" className="block hover:text-blue-600 py-2 font-medium">Contact</a>
            <a href="#login" className="block bg-blue-600 text-white px-6 py-3 rounded-lg text-center font-medium">
              Patient Login
            </a>
          </div>
        )}
      </header>

      {/* HERO - Professional Medical Design */}
      <section
        id="home"
        className="relative w-full min-h-[650px] flex items-center mt-16 bg-[#F4F0FF]"
      >
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <MdVerifiedUser className="text-lg" />
              HIPAA Compliant & Secure Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Quality Healthcare,
              <span className="text-[#9225b7]"> Delivered Virtually</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Connect with board-certified physicians from the comfort of your home. Available 24/7 for consultations, prescriptions, and ongoing care management.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href="#book-appointment"
                className="bg-[#9225b7] text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                Book Appointment
              </a>
              <a
                href="#how-it-works"
                className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all font-semibold"
              >
                How It Works
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-green-600 text-2xl" />
                <div>
                  <p className="font-semibold text-gray-900">100% Secure</p>
                  <p className="text-xs text-gray-500">HIPAA Compliant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaUserMd className="text-blue-600 text-2xl" />
                <div>
                  <p className="font-semibold text-gray-900">Board Certified</p>
                  <p className="text-xs text-gray-500">Licensed Doctors</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaAward className="text-yellow-600 text-2xl" />
                <div>
                  <p className="font-semibold text-gray-900">Award Winning</p>
                  <p className="text-xs text-gray-500">Top Rated Care</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative">
            <div className="relative bg-white rounded-2xl shadow-2xl  border border-gray-100">
              <img 
                src={banner} 
                alt="Healthcare Professional" 
                className="rounded-xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">5,000+</p>
                    <p className="text-sm text-gray-600">Happy Patients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION - Professional Medical Stats */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "15,000+", label: "Patients Treated", icon: "👥" },
              { value: "98%", label: "Satisfaction Rate", icon: "⭐" },
              { value: "24/7", label: "Availability", icon: "🕐" },
              { value: "50+", label: "Specialists", icon: "👨‍⚕️" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <h3 className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION - Professional & Credible */}
      <section id="about" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold mb-4">
              ABOUT OUR PLATFORM
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Leading Telemedicine Platform for Comprehensive Healthcare
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              MedicConsult provides secure, HIPAA-compliant virtual healthcare services connecting you with board-certified physicians across multiple specialties. Our platform ensures continuity of care with electronic health records, prescription management, and 24/7 medical support.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Board-Certified Physicians</h4>
                  <p className="text-gray-600 text-sm">All doctors are licensed, verified, and continuously credentialed</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Comprehensive Care</h4>
                  <p className="text-gray-600 text-sm">From urgent care to chronic disease management</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Secure & Private</h4>
                  <p className="text-gray-600 text-sm">End-to-end encryption with HIPAA compliance</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex-1">
                <p className="text-3xl font-bold text-blue-600">20+</p>
                <p className="text-sm text-gray-600 mt-1">Years Combined Experience</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex-1">
                <p className="text-3xl font-bold text-blue-600">ISO</p>
                <p className="text-sm text-gray-600 mt-1">Certified Platform</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80" 
              alt="Medical Team" 
              className="rounded-2xl shadow-xl w-full object-cover h-[600px]"
            />
          </div>
        </div>
      </section>

      {/* SERVICES - Professional Medical Services */}
      <section id="services" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold mb-4">
              OUR SERVICES
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Telemedicine Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Access quality healthcare services from licensed medical professionals through our secure platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <MdVideoCall size={40} />, 
                title: "Video Consultations", 
                desc: "HD video appointments with board-certified physicians. Secure, encrypted, and HIPAA-compliant virtual visits.",
                color: "blue"
              },
              { 
                icon: <FaPrescription size={40} />, 
                title: "E-Prescriptions", 
                desc: "Digital prescriptions sent directly to your preferred pharmacy. FDA-approved medication management.",
                color: "green"
              },
              { 
                icon: <IoFitnessSharp size={40} />, 
                title: "Health Monitoring", 
                desc: "Real-time vital signs tracking. Monitor blood pressure, glucose levels, and other health metrics.",
                color: "red"
              },
              { 
                icon: <BsCalendar2CheckFill size={40} />, 
                title: "Appointment Management", 
                desc: "Easy scheduling with automated reminders. Manage all your healthcare appointments in one place.",
                color: "purple"
              },
              { 
                icon: <BsChatDotsFill size={40} />, 
                title: "Secure Messaging", 
                desc: "HIPAA-compliant messaging with your care team. Get answers to follow-up questions quickly.",
                color: "indigo"
              },
              { 
                icon: <MdNotificationsActive size={40} />, 
                title: "Care Alerts", 
                desc: "Medication reminders and preventive care notifications. Stay on top of your health goals.",
                color: "orange"
              },
            ].map((service, i) => (
              <div 
                key={i} 
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:border-blue-300"
              >
                <div className={`w-16 h-16 bg-${service.color}-100 rounded-lg flex items-center justify-center text-${service.color}-600 mb-6`}>
                  {service.icon}
                </div>
                
                <h3 className="font-bold text-xl text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-6 bg-[#F4F0FF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Get started with virtual care in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Sign up and complete your medical profile securely" },
              { step: "02", title: "Book Appointment", desc: "Choose your doctor and preferred time slot" },
              { step: "03", title: "Start Consultation", desc: "Meet your doctor via secure video call" }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-8 text-center shadow-lg">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Professional Patient Reviews */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold mb-4">
              PATIENT TESTIMONIALS
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
            <p className="text-lg text-gray-600">Trusted by thousands of patients for quality healthcare</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Sarah Johnson", 
                role: "Patient since 2023",
                text: "The convenience of virtual appointments has been life-changing. The doctors are professional, thorough, and genuinely care about my health.",
                rating: 5
              },
              { 
                name: "Michael Chen", 
                role: "Patient since 2022",
                text: "Excellent service! I was able to get a prescription renewed within hours. The platform is easy to use and the doctors are very knowledgeable.",
                rating: 5
              },
              { 
                name: "Emily Rodriguez", 
                role: "Patient since 2023",
                text: "As a busy professional, having 24/7 access to healthcare is invaluable. The quality of care matches in-person visits.",
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 bg-[#9225b7] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Better Healthcare?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of patients who trust MedicConsult for their healthcare needs</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#signup" className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all font-bold text-lg">
              Get Started Today
            </a>
            <a href="#contact" className="border-2 border-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all font-bold text-lg">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER - Professional & Comprehensive */}
      <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">M</span>
                </div>
                <h3 className="text-xl font-bold">MedicConsult</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Professional telemedicine platform connecting patients with board-certified physicians for quality virtual healthcare.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all">
                  <FaFacebookF />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all">
                  <FaTwitter />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all">
                  <FaLinkedinIn />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all">
                  <FaInstagram />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Our Services</a></li>
                <li><a href="#doctors" className="hover:text-white transition-colors">Find a Doctor</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#insurance" className="hover:text-white transition-colors">Insurance</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Patient Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#hipaa" className="hover:text-white transition-colors">HIPAA Compliance</a></li>
                <li><a href="#support" className="hover:text-white transition-colors">Support Center</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contact Information</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <FaPhoneAlt className="text-blue-400 mt-1" />
                  <div>
                    <p className="text-white font-semibold">+1 (800) 123-4567</p>
                    <p className="text-xs">24/7 Support Line</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MdEmail className="text-blue-400 mt-1 text-lg" />
                  <div>
                    <p className="text-white font-semibold">support@medicconsult.com</p>
                    <p className="text-xs">Email Support</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-blue-400 mt-1" />
                  <div>
                    <p className="text-white font-semibold">Mumbai, India</p>
                    <p className="text-xs">Corporate Headquarters</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MedicConsult. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#accessibility" className="hover:text-white transition-colors">Accessibility</a>
              <a href="#sitemap" className="hover:text-white transition-colors">Sitemap</a>
              <a href="#careers" className="hover:text-white transition-colors">Careers</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}