import { Link } from 'react-router-dom';
import { FaCrown, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 border-t border-yellow-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-900/30">
                <FaCrown className="text-black" size={16} />
              </div>
              <span className="font-bold text-xl text-white">Drive<span className="text-yellow-400">Lux</span></span>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Premium car rental platform. Find your perfect ride from our wide selection of vehicles across Pakistan.
            </p>
            <div className="flex gap-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-yellow-600 hover:text-black rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/cars', 'Browse Cars'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm hover:text-yellow-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Car Rental</li>
              <li>Chauffeur Service</li>
              <li>Airport Transfer</li>
              <li>Long-term Rental</li>
              <li>Corporate Booking</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><FaPhone size={13} className="text-yellow-400" /> +92 300 123 4567</li>
              <li className="flex items-center gap-2"><FaEnvelope size={13} className="text-yellow-400" /> support@drivelux.com</li>
              <li className="flex items-center gap-2"><FaMapMarkerAlt size={13} className="text-yellow-400" /> Lahore, Karachi, Islamabad</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-yellow-900/30 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2026 DriveLux. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
