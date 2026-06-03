import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTachometerAlt, FaUsers, FaCar, FaCalendarAlt, FaStar, FaMoneyBillWave, FaSignOutAlt, FaCheckCircle, FaTimesCircle, FaComments, FaPaperPlane, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatDate, getStatusColor, getInitials } from '../../utils/helpers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-toastify';
import { getSocket } from '../../hooks/useSocket';

const NAV_ITEMS = [
  { path: '', icon: FaTachometerAlt, label: 'Dashboard' },
  { path: 'users', icon: FaUsers, label: 'Users' },
  { path: 'cars', icon: FaCar, label: 'Cars' },
  { path: 'bookings', icon: FaCalendarAlt, label: 'Bookings' },
  { path: 'messages', icon: FaComments, label: 'Messages' },
  { path: 'reviews', icon: FaStar, label: 'Reviews' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === `/admin${path ? `/${path}` : ''}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6">
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="card p-5 sticky top-24">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 text-black rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2">
                {getInitials(user?.name)}
              </div>
              <p className="font-semibold text-white text-sm">{user?.name}</p>
              <span className="badge bg-yellow-100 text-yellow-800 text-xs mt-1">Admin</span>
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link key={item.path} to={`/admin${item.path ? `/${item.path}` : ''}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.path) ? 'bg-yellow-100/20 text-yellow-400' : 'text-gray-400 hover:bg-gray-800'}`}>
                  <item.icon size={15} /> {item.label}
                </Link>
              ))}
              <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-900/20 transition-colors">
                <FaSignOutAlt size={15} /> Sign Out
              </button>
            </nav>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <Routes>
            <Route index element={<AdminStats />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="cars" element={<AdminCars />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function AdminStats() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: () => axiosInstance.get('/admin/dashboard').then(r => r.data) });
  const stats = data?.data?.stats;
  const recent = data?.data?.recentBookings;
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">Admin Dashboard</h2>
      {isLoading ? <p className="text-gray-400">Loading...</p> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats?.totalUsers, color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
              { label: 'Total Cars', value: stats?.totalCars, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
              { label: 'Total Bookings', value: stats?.totalBookings, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              { label: 'Drivers', value: stats?.totalDrivers, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { label: 'Revenue', value: formatPrice(stats?.totalRevenue || 0), color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={`card p-4 text-center ${s.bg}`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-white mb-4">Recent Bookings</h3>
            <div className="space-y-3">
              {recent?.slice(0, 8).map((b) => (
                <div key={b._id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{b.car?.name}</p>
                    <p className="text-xs text-gray-400">{b.user?.name} · {formatDate(b.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`badge text-xs ${getStatusColor(b.status)}`}>{b.status}</span>
                    <p className="text-xs font-bold text-yellow-400 mt-0.5">{formatPrice(b.totalAmount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-users', page, search], queryFn: () => axiosInstance.get('/admin/users', { params: { page, limit: 15, search } }).then(r => r.data) });

  const toggleUser = useMutation({
    mutationFn: ({ id, isActive }) => axiosInstance.put(`/admin/users/${id}`, { isActive }),
    onSuccess: () => { qc.invalidateQueries(['admin-users']); toast.success('User updated'); },
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">User Management</h2>
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field py-2 text-sm max-w-xs" placeholder="Search users..." />
        </div>
        {isLoading ? <div className="p-8 text-center text-gray-400">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr>{['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data?.data?.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-yellow-900/30">{getInitials(u.name)}</div>
                        <span className="font-medium text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{u.email}</td>
                    <td className="px-4 py-3"><span className={`badge capitalize text-xs ${u.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : u.role === 'driver' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>{u.role}</span></td>
                    <td className="px-4 py-3"><span className={`badge text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleUser.mutate({ id: u._id, isActive: !u.isActive })} className={`text-xs px-3 py-1 rounded-lg font-medium ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'} transition-colors`}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminCars() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-cars'], queryFn: () => axiosInstance.get('/admin/cars').then(r => r.data) });
  const verifyCar = useMutation({
    mutationFn: ({ id, isVerified }) => axiosInstance.put(`/admin/cars/${id}/verify`, { isVerified }),
    onSuccess: () => { qc.invalidateQueries(['admin-cars']); toast.success('Car updated'); },
  });
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">Car Management</h2>
      {isLoading ? <p className="text-gray-400">Loading...</p> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data?.map((car) => (
            <div key={car._id} className="card overflow-hidden">
              <img src={car.images?.[0]?.url || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400'} alt="" className="w-full h-36 object-cover" />
              <div className="p-4">
                <p className="font-semibold text-white text-sm">{car.name}</p>
                <p className="text-xs text-gray-400">Owner: {car.owner?.name}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`badge text-xs ${car.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {car.isVerified ? 'Verified' : 'Pending'}
                  </span>
                  <button onClick={() => verifyCar.mutate({ id: car._id, isVerified: !car.isVerified })} className={`text-xs flex items-center gap-1 font-medium transition-colors ${car.isVerified ? 'text-red-500' : 'text-green-600'}`}>
                    {car.isVerified ? <><FaTimesCircle size={12} /> Unverify</> : <><FaCheckCircle size={12} /> Verify</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState('');
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-bookings', statusFilter], queryFn: () => axiosInstance.get('/admin/bookings', { params: statusFilter ? { status: statusFilter } : {} }).then(r => r.data) });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => axiosInstance.put(`/bookings/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries(['admin-bookings']); toast.success('Booking status updated!'); },
    onError: (err) => toast.error(err?.response?.data?.message || 'Update failed'),
  });

  const statusActions = {
    pending: [
      { label: 'Approve', status: 'approved', color: 'text-green-600 hover:bg-green-50 hover:bg-green-900/20' },
      { label: 'Cancel', status: 'cancelled', color: 'text-red-600 hover:bg-red-900/20' },
    ],
    approved: [
      { label: 'Mark Active', status: 'active', color: 'text-blue-600 hover:bg-blue-50 hover:bg-blue-900/20' },
      { label: 'Cancel', status: 'cancelled', color: 'text-red-600 hover:bg-red-900/20' },
    ],
    active: [
      { label: 'Complete', status: 'completed', color: 'text-green-600 hover:bg-green-50 hover:bg-green-900/20' },
      { label: 'Cancel', status: 'cancelled', color: 'text-red-600 hover:bg-red-900/20' },
    ],
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">Booking Management</h2>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field py-1.5 text-sm w-auto">
          <option value="">All Statuses</option>
          {['pending','approved','active','completed','cancelled'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>
      {isLoading ? <p className="text-gray-400">Loading...</p> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>{['Car', 'Customer', 'Dates', 'Amount', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data?.data?.map((b) => (
                <tr key={b._id} className="hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-medium text-white">{b.car?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{b.user?.name}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(b.startDate)} – {formatDate(b.endDate)}</td>
                  <td className="px-4 py-3 font-bold text-yellow-400 text-sm">{formatPrice(b.totalAmount)}</td>
                  <td className="px-4 py-3"><span className={`badge text-xs capitalize ${getStatusColor(b.status)}`}>{b.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {statusActions[b.status]?.map((action) => (
                        <button
                          key={action.status}
                          onClick={() => updateStatus.mutate({ id: b._id, status: action.status })}
                          disabled={updateStatus.isPending}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${action.color}`}
                        >
                          {action.label}
                        </button>
                      ))}
                      {['completed', 'cancelled'].includes(b.status) && (
                        <span className="text-xs text-gray-400 italic">—</span>
                      )}
                      <button
                        onClick={() => {
                          localStorage.setItem('adminMsgTarget', JSON.stringify({ id: b.user?._id, name: b.user?.name }));
                          navigate('/admin/messages');
                        }}
                        className="text-xs px-2.5 py-1 rounded-lg font-medium text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                        title="Message customer"
                      >
                        <FaComments size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminReviews() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-reviews'], queryFn: () => axiosInstance.get('/admin/reviews').then(r => r.data) });
  const deleteReview = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/admin/reviews/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-reviews']); toast.success('Review deleted'); },
  });
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">Review Management</h2>
      {isLoading ? <p className="text-gray-400">Loading...</p> : (
        <div className="space-y-3">
          {data?.data?.map((r) => (
            <div key={r._id} className="card p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-yellow-900/30">{getInitials(r.user?.name)}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm text-white">{r.user?.name}</p>
                    <span className="text-xs text-gray-400">on {r.car?.name}</span>
                    <span className="text-amber-500 text-xs font-medium">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{r.comment}</p>
                </div>
              </div>
              <button onClick={() => deleteReview.mutate(r._id)} className="text-red-400 hover:text-red-500 text-xs font-medium flex-shrink-0">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConvs = async () => {
    try {
      const { data } = await axiosInstance.get('/messages/conversations');
      setConversations(data.data || []);
    } catch {} finally { setLoading(false); }
  };

  const fetchMessages = async (convId) => {
    setMsgLoading(true);
    try {
      const { data } = await axiosInstance.get(`/messages/conversations/${convId}`);
      setMessages(data.data || []);
    } catch {} finally { setMsgLoading(false); }
  };

  useEffect(() => { fetchConvs(); }, []);

  useEffect(() => {
    if (selectedConv) fetchMessages(selectedConv);
    else setMessages([]);
  }, [selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.on('receiveMessage', () => { if (selectedConv) fetchMessages(selectedConv); fetchConvs(); });
    return () => { socket.off('receiveMessage'); };
  }, [selectedConv]);

  useEffect(() => {
    if (selectedConv) {
      const socket = getSocket();
      socket?.emit('joinRoom', selectedConv);
    }
  }, [selectedConv]);

  const selectedConvData = conversations.find(c => c._id === selectedConv);
  const otherParticipant = selectedConvData?.participants?.find(p => p._id !== user?._id);

  const handleSend = async () => {
    if (!text.trim() || !selectedConv) return;
    try {
      await axiosInstance.post('/messages', { conversationId: selectedConv, content: text.trim() });
      setText('');
      fetchMessages(selectedConv);
      fetchConvs();
    } catch { toast.error('Failed to send'); }
  };

  const handleNewConversation = async (participantId, participantName) => {
    try {
      const { data } = await axiosInstance.post('/messages/conversations', { participantId });
      setSelectedConv(data.data._id);
      setShowMobileList(false);
      fetchConvs();
      localStorage.removeItem('adminMsgTarget');
    } catch { toast.error('Failed to start conversation'); }
  };

  useEffect(() => {
    const target = localStorage.getItem('adminMsgTarget');
    if (target) {
      try {
        const { id, name } = JSON.parse(target);
        handleNewConversation(id, name);
      } catch { localStorage.removeItem('adminMsgTarget'); }
    }
  }, []);

  const formatMsgTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">Messages</h2>
      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="flex h-full">
          <div className={`w-full md:w-72 border-r border-gray-800 flex-shrink-0 ${showMobileList ? 'block' : 'hidden md:block'}`}>
            <div className="p-3 border-b border-gray-800">
              <p className="text-xs font-semibold text-gray-500 uppercase">Conversations</p>
            </div>
            <div className="overflow-y-auto h-[calc(100%-53px)]">
              {loading ? (
                <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <FaComments size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No conversations</p>
                </div>
              ) : conversations.map((conv) => {
                const other = conv.participants?.find(p => p._id !== user?._id);
                const isActive = selectedConv === conv._id;
                return (
                  <button key={conv._id} onClick={() => { setSelectedConv(conv._id); setShowMobileList(false); }}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-gray-800/50 ${isActive ? 'bg-yellow-400/10' : ''}`}>
                    <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-yellow-900/30">{getInitials(other?.name)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white truncate">{other?.name}</p>
                      {conv.lastMessage && <p className="text-xs text-gray-400 truncate">{conv.lastMessage?.content}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`flex-1 flex flex-col ${!showMobileList ? 'block' : 'hidden md:flex'}`}>
            {selectedConv ? (
              <>
                <div className="flex items-center gap-3 p-3 border-b border-gray-800 bg-gray-900">
                  <button onClick={() => { setSelectedConv(null); setShowMobileList(true); }} className="md:hidden p-1 hover:bg-gray-100 hover:bg-gray-800 rounded-lg">
                    <FaArrowLeft size={16} className="text-gray-500" />
                  </button>
                  <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-yellow-900/30">{getInitials(otherParticipant?.name)}</div>
                  <p className="font-semibold text-sm text-white flex-1">{otherParticipant?.name || 'Unknown'}</p>
                  <button onClick={() => {
                    if (window.confirm('Delete this conversation?')) {
                      axiosInstance.delete(`/messages/conversations/${selectedConv}`).then(() => { setSelectedConv(null); setShowMobileList(true); fetchConvs(); toast.success('Conversation deleted'); }).catch(() => toast.error('Failed to delete'));
                    }
                  }} className="p-2 hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Delete conversation">
                    <FaTrash size={13} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-950">
                  {msgLoading ? <div className="text-center text-gray-400 text-sm py-8">Loading...</div> :
                    messages.length === 0 ? <div className="text-center text-gray-400 text-sm py-8">No messages yet</div> :
                    messages.map((msg) => {
                      const isMine = msg.sender?._id === user?._id;
                      return (
                        <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${isMine ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-br-md' : 'bg-gray-800 text-white border border-gray-700 rounded-bl-md'}`}>
                            <p className="break-words">{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${isMine ? 'text-yellow-200' : 'text-gray-400'}`}>{formatMsgTime(msg.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-3 border-t border-gray-800 bg-gray-900">
                  <div className="flex items-center gap-2">
                    <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type a message..." className="input-field py-2 text-sm flex-1" />
                    <button onClick={handleSend} disabled={!text.trim()} className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 disabled:bg-gray-600 text-black rounded-xl flex items-center justify-center transition-colors shadow-md shadow-yellow-900/30">
                      <FaPaperPlane size={14} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FaComments size={48} className="text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400">Click on a user/booking to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
