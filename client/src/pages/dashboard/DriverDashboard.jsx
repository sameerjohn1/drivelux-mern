import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCar, FaCalendarAlt, FaMoneyBillWave, FaToggleOn, FaUser, FaSignOutAlt, FaComments, FaPaperPlane, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatDate, getStatusColor, getInitials } from '../../utils/helpers';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSocket } from '../../hooks/useSocket';

const NAV_ITEMS = [
  { path: '', icon: FaCalendarAlt, label: 'Bookings' },
  { path: 'cars', icon: FaCar, label: 'My Cars' },
  { path: 'earnings', icon: FaMoneyBillWave, label: 'Earnings' },
  { path: 'messages', icon: FaComments, label: 'Messages' },
  { path: 'profile', icon: FaUser, label: 'Profile' },
];

export default function DriverDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === `/driver${path ? `/${path}` : ''}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6">
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="card p-5 sticky top-24">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2 shadow-lg shadow-yellow-900/30">
                {getInitials(user?.name)}
              </div>
              <p className="font-semibold text-white text-sm">{user?.name}</p>
              <span className="badge bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 text-xs mt-1">Driver</span>
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link key={item.path} to={`/driver${item.path ? `/${item.path}` : ''}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.path) ? 'bg-yellow-400/10 text-yellow-400' : 'text-gray-300 hover:bg-gray-800'}`}>
                  <item.icon size={15} /> {item.label}
                </Link>
              ))}
              <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:bg-red-900/20 transition-colors">
                <FaSignOutAlt size={15} /> Sign Out
              </button>
            </nav>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <Routes>
            <Route index element={<DriverBookings />} />
            <Route path="cars" element={<DriverCars />} />
            <Route path="earnings" element={<DriverEarnings />} />
            <Route path="messages" element={<DriverMessages />} />
            <Route path="profile" element={<DriverProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function DriverBookings() {
  const { data, isLoading } = useQuery({ queryKey: ['driver-bookings'], queryFn: () => axiosInstance.get('/drivers/bookings').then(r => r.data) });
  const navigate = useNavigate();
  const createConvMutation = useMutation({
    mutationFn: (participantId) => axiosInstance.post('/messages/conversations', { participantId }).then(r => r.data),
    onSuccess: (res) => { navigate('/driver/messages'); },
    onError: () => toast.error('Failed to start conversation'),
  });
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">Driver Bookings</h2>
      {isLoading ? <p className="text-gray-400">Loading...</p> : (
        <div className="space-y-3">
          {data?.data?.length === 0 ? (
            <div className="card p-10 text-center"><FaCalendarAlt size={40} className="text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No bookings yet</p></div>
          ) : data?.data?.map((booking) => (
            <div key={booking._id} className="card p-4 flex items-center gap-4">
              <img src={booking.car?.images?.[0]?.url || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=200'} alt="" className="w-20 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-white">{booking.car?.name}</p>
                <p className="text-xs text-gray-400">{formatDate(booking.startDate)} – {formatDate(booking.endDate)}</p>
                <p className="text-xs text-gray-500">Customer: {booking.user?.name}</p>
              </div>
              <div className="text-right">
                <span className={`badge text-xs ${getStatusColor(booking.status)}`}>{booking.status}</span>
                <p className="text-sm font-bold text-yellow-400 mt-1">{formatPrice(booking.totalAmount)}</p>
                {booking.user?._id && (
                  <button onClick={() => createConvMutation.mutate(booking.user._id)} className="text-xs flex items-center gap-1 text-yellow-400 hover:text-yellow-300 font-medium mt-2">
                    <FaComments size={12} /> Message
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DriverCars() {
  const { data, isLoading } = useQuery({ queryKey: ['my-cars'], queryFn: () => axiosInstance.get('/cars/my-cars').then(r => r.data) });
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">My Cars</h2>
        <Link to="/cars" className="btn-primary text-sm py-2 px-4">+ Add Car</Link>
      </div>
      {isLoading ? <p className="text-gray-400">Loading...</p> : (
        <div className="grid sm:grid-cols-2 gap-4">
          {data?.data?.length === 0 ? (
            <div className="card p-8 text-center col-span-2"><FaCar size={40} className="text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No cars listed yet</p></div>
          ) : data?.data?.map((car) => (
            <div key={car._id} className="card p-4">
              <img src={car.images?.[0]?.url} alt="" className="w-full h-36 object-cover rounded-xl mb-3" />
              <p className="font-semibold text-white">{car.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-yellow-400 font-bold text-sm">{formatPrice(car.pricePerDay)}/day</span>
                <span className={`badge text-xs ${car.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{car.isAvailable ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DriverEarnings() {
  const { data, isLoading } = useQuery({ queryKey: ['driver-earnings'], queryFn: () => axiosInstance.get('/drivers/earnings').then(r => r.data) });
  const stats = data?.data;
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">Earnings</h2>
      {isLoading ? <p className="text-gray-400">Loading...</p> : (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Earnings', value: formatPrice(stats?.totalEarnings || 0), color: 'text-green-600' },
              { label: 'Completed Trips', value: stats?.completedBookings || 0, color: 'text-yellow-400' },
              { label: 'Avg per Trip', value: stats?.completedBookings ? formatPrice((stats?.totalEarnings || 0) / stats.completedBookings) : 'N/A', color: 'text-purple-600' },
            ].map((s, i) => (
              <div key={i} className="card p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DriverProfile() {
  const { user } = useAuth();
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">Driver Profile</h2>
      <div className="card p-6 max-w-lg">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-yellow-900/30">{getInitials(user?.name)}</div>
          <div><p className="font-bold text-white">{user?.name}</p><p className="text-sm text-gray-500">{user?.email}</p></div>
        </div>
        <p className="text-sm text-gray-400">Manage your driver profile, license details, and availability from here.</p>
      </div>
    </div>
  );
}

function DriverMessages() {
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
  useEffect(() => { if (selectedConv) fetchMessages(selectedConv); else setMessages([]); }, [selectedConv]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.on('receiveMessage', () => { if (selectedConv) fetchMessages(selectedConv); fetchConvs(); });
    return () => { socket.off('receiveMessage'); };
  }, [selectedConv]);
  useEffect(() => { if (selectedConv) getSocket()?.emit('joinRoom', selectedConv); }, [selectedConv]);

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

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toDateString() === new Date().toDateString()
      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
              {loading ? <div className="p-8 text-center text-gray-400 text-sm">Loading...</div> : conversations.length === 0 ? (
                <div className="p-8 text-center"><FaComments size={32} className="text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-500">No conversations</p></div>
              ) : conversations.map((conv) => {
                const other = conv.participants?.find(p => p._id !== user?._id);
                return (
                  <button key={conv._id} onClick={() => { setSelectedConv(conv._id); setShowMobileList(false); }}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-gray-800/50 ${selectedConv === conv._id ? 'bg-yellow-400/10' : ''}`}>
                    <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-yellow-900/30">{getInitials(other?.name)}</div>
                    <div className="flex-1 min-w-0"><p className="font-medium text-sm text-white truncate">{other?.name}</p>{conv.lastMessage && <p className="text-xs text-gray-400 truncate">{conv.lastMessage?.content}</p>}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className={`flex-1 flex flex-col ${!showMobileList ? 'block' : 'hidden md:flex'}`}>
            {selectedConv ? (
              <>
                <div className="flex items-center gap-3 p-3 border-b border-gray-800 bg-gray-900">
                  <button onClick={() => { setSelectedConv(null); setShowMobileList(true); }} className="md:hidden p-1 hover:bg-gray-800 rounded-lg"><FaArrowLeft size={16} className="text-gray-500" /></button>
                  <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-yellow-900/30">{getInitials(otherParticipant?.name)}</div>
                  <p className="font-semibold text-sm text-white flex-1">{otherParticipant?.name || 'Unknown'}</p>
                  <button onClick={() => {
                    if (window.confirm('Delete this conversation?')) {
                      axiosInstance.delete(`/messages/conversations/${selectedConv}`).then(() => { setSelectedConv(null); setShowMobileList(true); toast.success('Conversation deleted'); }).catch(() => toast.error('Failed to delete'));
                    }
                  }} className="p-2 hover:bg-red-50 hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Delete conversation">
                    <FaTrash size={13} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-950">
                  {msgLoading ? <div className="text-center text-gray-400 text-sm py-8">Loading...</div> : messages.length === 0 ? <div className="text-center text-gray-400 text-sm py-8">No messages yet</div> : messages.map((msg) => {
                    const isMine = msg.sender?._id === user?._id;
                    return (
                      <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${isMine ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-br-md' : 'bg-gray-800 text-white border border-gray-700 rounded-bl-md'}`}>
                          <p className="break-words">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMine ? 'text-yellow-200' : 'text-gray-400'}`}>{formatTime(msg.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-3 border-t border-gray-800 bg-gray-900">
                  <div className="flex items-center gap-2">
                    <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type a message..." className="input-field py-2 text-sm flex-1" />
                    <button onClick={handleSend} disabled={!text.trim()} className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 disabled:bg-gray-600 text-black rounded-xl flex items-center justify-center transition-colors shadow-md shadow-yellow-900/30"><FaPaperPlane size={14} /></button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center"><FaComments size={48} className="text-gray-200 dark:text-gray-700 mx-auto mb-3" /><p className="text-gray-400">Select a conversation</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
