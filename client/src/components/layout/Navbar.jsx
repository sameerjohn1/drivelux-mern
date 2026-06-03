import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaBell, FaBars, FaTimes, FaUser, FaSignOutAlt, FaTachometerAlt, FaCheckDouble } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useGetNotificationsQuery, useMarkNotificationReadMutation, useMarkAllReadMutation } from '../../store/api/apiSlice';
import { getSocket } from '../../hooks/useSocket';
import { getInitials } from '../../utils/helpers';
import { formatDate } from '../../utils/helpers';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const { data: notifData, refetch: refetchNotifs } = useGetNotificationsQuery({ limit: 5 }, { skip: !isAuthenticated });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAll] = useMarkAllReadMutation();
  const unreadCount = notifData?.unread || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const socket = getSocket();
    if (!socket) return;
    const handler = () => refetchNotifs();
    socket.on('bookingUpdate', handler);
    socket.on('newNotification', handler);
    return () => {
      socket.off('bookingUpdate', handler);
      socket.off('newNotification', handler);
    };
  }, [isAuthenticated, refetchNotifs]);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); setNotifOpen(false); }, [location]);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'driver') return '/driver';
    return '/dashboard';
  };

  const handleNotifClick = async (n) => {
    if (!n.isRead) await markRead(n._id);
    setNotifOpen(false);
    if (n.type === 'chat') navigate(`${getDashboardLink()}/messages`);
    else if (n.type === 'booking') navigate(getDashboardLink());
    else if (n.type === 'admin') navigate(getDashboardLink());
    else navigate(getDashboardLink());
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/cars', label: 'Cars' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-950/95 backdrop-blur-sm shadow-lg shadow-black/30' : 'bg-gray-950'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-900/30">
              <FaCrown className="text-black" size={16} />
            </div>
            <span className="font-bold text-xl text-white">Drive<span className="text-yellow-400">Lux</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${location.pathname === link.to ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <FaBell className="text-gray-400" size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-80 card shadow-xl py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-yellow-900/30 flex items-center justify-between">
                          <p className="font-semibold text-sm text-white">Notifications</p>
                          {unreadCount > 0 && (
                            <button onClick={() => { markAll(); setNotifOpen(false); }} className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                              <FaCheckDouble size={11} /> Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifData?.data?.length === 0 ? (
                            <div className="p-6 text-center">
                              <p className="text-sm text-gray-400">No notifications</p>
                            </div>
                          ) : notifData?.data?.map((n) => (
                            <button key={n._id} onClick={() => handleNotifClick(n)}
                              className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${!n.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-primary-500' : 'bg-transparent'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{n.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-800 transition-colors">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-yellow-600 text-black rounded-full flex items-center justify-center text-xs font-bold">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium text-gray-300 max-w-[100px] truncate">{user?.name}</span>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-52 card shadow-xl py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-yellow-900/30">
                          <p className="font-semibold text-sm text-white">{user?.name}</p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                        <Link to={getDashboardLink()} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 text-sm text-gray-300 transition-colors">
                          <FaTachometerAlt size={13} /> Dashboard
                        </Link>
                        <Link to="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 text-sm text-gray-300 transition-colors">
                          <FaUser size={13} /> Profile
                        </Link>
                        <hr className="border-yellow-900/30 my-1" />
                        <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-900/30 text-sm text-red-400 transition-colors">
                          <FaSignOutAlt size={13} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors">
              {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-yellow-900/30 py-4 space-y-1"
            >
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 text-gray-400 transition-colors">
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="flex-1 text-center btn-outline text-sm py-2">Login</Link>
                  <Link to="/register" className="flex-1 text-center btn-primary text-sm py-2">Register</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
