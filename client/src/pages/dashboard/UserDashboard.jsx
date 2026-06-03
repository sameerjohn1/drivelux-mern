import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCar, FaCalendarAlt, FaHeart, FaBell, FaComments, FaCreditCard, FaStar, FaSignOutAlt, FaPaperPlane, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useGetMyBookingsQuery, useGetNotificationsQuery, useGetWishlistQuery, useMarkAllReadMutation, useRemoveFromWishlistMutation, useMarkNotificationReadMutation, useGetConversationsQuery, useGetOrCreateConversationMutation, useGetMessagesQuery, useSendMessageMutation, useCreateReviewMutation } from '../../store/api/apiSlice';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import { getInitials } from '../../utils/helpers';
import { toast } from 'react-toastify';
import { getSocket } from '../../hooks/useSocket';
import axiosInstance from '../../utils/axios';

const NAV_ITEMS = [
  { path: '', icon: FaCalendarAlt, label: 'Bookings' },
  { path: 'profile', icon: FaUser, label: 'Profile' },
  { path: 'wishlist', icon: FaHeart, label: 'Wishlist' },
  { path: 'notifications', icon: FaBell, label: 'Notifications' },
  { path: 'messages', icon: FaComments, label: 'Messages' },
  { path: 'payments', icon: FaCreditCard, label: 'Payments' },
];

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => {
    const full = `/dashboard${path ? `/${path}` : ''}`;
    return location.pathname === full;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="card p-5 sticky top-24">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2 shadow-lg shadow-yellow-900/30">
                {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : getInitials(user?.name)}
              </div>
              <p className="font-semibold text-white text-sm">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link key={item.path} to={`/dashboard${item.path ? `/${item.path}` : ''}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.path) ? 'bg-yellow-400/10 text-yellow-400' : 'text-gray-300 hover:bg-gray-800'}`}>
                  <item.icon size={15} /> {item.label}
                </Link>
              ))}
              <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <FaSignOutAlt size={15} /> Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Routes>
            <Route index element={<BookingsTab />} />
            <Route path="profile" element={<ProfileTab />} />
            <Route path="wishlist" element={<WishlistTab />} />
            <Route path="notifications" element={<NotificationsTab />} />
            <Route path="messages" element={<MessagesTab />} />
            <Route path="payments" element={<PaymentsTab />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function BookingsTab() {
  const { user } = useAuth();
  const { data, isLoading } = useGetMyBookingsQuery();
  const [createConv] = useGetOrCreateConversationMutation();
  const [createReview, { isLoading: reviewLoading }] = useCreateReviewMutation();
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const handleMessageContact = async (booking) => {
    const contactId = booking.driver?.user?._id || booking.car?.owner?._id;
    if (!contactId) {
      toast.error('No contact available for this booking yet');
      return;
    }
    try {
      await createConv({ participantId: contactId, bookingId: booking._id }).unwrap();
      navigate('/dashboard/messages');
    } catch {
      toast.error('Failed to start conversation');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewRating) { toast.error('Please select a rating'); return; }
    try {
      await createReview({ carId: selectedBooking.car._id, bookingId: selectedBooking._id, rating: reviewRating, comment: reviewComment, title: '' }).unwrap();
      toast.success('Review submitted!');
      setReviewRating(0);
      setReviewComment('');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">My Bookings</h2>
      {isLoading ? <p className="text-gray-400">Loading...</p> : data?.data?.length === 0 ? (
        <div className="card p-10 text-center">
          <FaCalendarAlt size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No bookings yet. <Link to="/cars" className="text-yellow-400 font-medium">Browse cars</Link></p>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.data?.map((booking) => (
            <motion.div key={booking._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4 transition-colors">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                <img src={booking.car?.images?.[0]?.url || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=200'} alt="" className="w-20 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">{booking.car?.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(booking.startDate)} → {formatDate(booking.endDate)}</p>
                  <p className="text-sm font-bold text-yellow-400 mt-1">{formatPrice(booking.totalAmount)}</p>
                </div>
                <div className="flex flex-col items-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <span className={`badge px-3 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>{booking.status}</span>
                  {(booking.driver?.user?._id || booking.car?.owner?._id) && (
                    <button
                      onClick={() => handleMessageContact(booking)}
                      className="text-xs flex items-center gap-1 text-yellow-400 hover:text-yellow-300 font-medium"
                    >
                      <FaComments size={12} /> {booking.driver?.user?._id ? 'Message Driver' : 'Message Owner'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => { setSelectedBooking(null); setReviewRating(0); setReviewComment(''); }}>
          <div className="bg-gray-950 border border-yellow-900/30 rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Booking Details</h3>
              <button onClick={() => { setSelectedBooking(null); setReviewRating(0); setReviewComment(''); }} className="text-gray-400 hover:text-white text-xl">&times;</button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <img src={selectedBooking.car?.images?.[0]?.url || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=200'} alt="" className="w-24 h-[72px] rounded-xl object-cover flex-shrink-0" />
              <div>
                <p className="font-bold text-white text-lg">{selectedBooking.car?.name}</p>
                <p className="text-xs text-gray-400">{formatDate(selectedBooking.startDate)} → {formatDate(selectedBooking.endDate)}</p>
                <p className="text-sm font-bold text-yellow-400 mt-1">{formatPrice(selectedBooking.totalAmount)}</p>
                <span className={`badge px-3 py-1 text-xs font-medium mt-2 inline-block ${getStatusColor(selectedBooking.status)}`}>{selectedBooking.status}</span>
              </div>
            </div>

            {selectedBooking.status === 'completed' ? (
              <div>
                <h4 className="font-bold text-white mb-3">Rate & Review</h4>
                <form onSubmit={handleReviewSubmit}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Rating</label>
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)} className="transition-colors">
                        <FaStar size={24} className={star <= reviewRating ? 'text-yellow-400' : 'text-gray-600'} />
                      </button>
                    ))}
                    <span className="text-xs text-gray-400 ml-2">{reviewRating > 0 ? `${reviewRating}/5` : 'Tap to rate'}</span>
                  </div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Your Review</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    className="input-field resize-none text-sm mb-3"
                    placeholder="Share your experience..."
                  />
                  <button type="submit" disabled={reviewLoading} className="btn-primary text-sm py-2 px-6">
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">You can rate and review after the booking is completed.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileTab() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const axiosInstance = (await import('../../utils/axios')).default;
      const { data } = await axiosInstance.put('/users/profile', form);
      updateUser(data.data);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">My Profile</h2>
      <div className="card p-6 max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="+92..." />
          </div>
          <button onClick={handleSave} disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function WishlistTab() {
  const { data, isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">My Wishlist</h2>
      {isLoading ? <p className="text-gray-400">Loading...</p> : data?.data?.cars?.length === 0 ? (
        <div className="card p-10 text-center">
          <FaHeart size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No saved cars. <Link to="/cars" className="text-yellow-400 font-medium">Browse cars</Link></p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {data?.data?.cars?.map((car) => (
            <div key={car._id} className="card p-4 flex gap-3 items-center">
              <img src={car.images?.[0]?.url} alt="" className="w-20 h-14 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-white line-clamp-1">{car.name}</p>
                <p className="text-yellow-400 font-bold text-sm">{formatPrice(car.pricePerDay)}/day</p>
              </div>
              <button onClick={() => removeFromWishlist(car._id).then(() => toast.success('Removed'))} className="text-red-400 hover:text-red-500">
                <FaHeart size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsTab() {
  const { data } = useGetNotificationsQuery({});
  const [markAll] = useMarkAllReadMutation();
  const [markRead] = useMarkNotificationReadMutation();
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">Notifications</h2>
        {data?.unread > 0 && <button onClick={() => markAll()} className="text-sm text-yellow-400 font-medium hover:text-primary-700">Mark all read</button>}
      </div>
      <div className="space-y-3">
        {data?.data?.length === 0 ? (
          <div className="card p-10 text-center"><FaBell size={40} className="text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No notifications</p></div>
        ) : data?.data?.map((n) => (
          <div key={n._id} onClick={() => !n.isRead && markRead(n._id)} className={`card p-4 flex gap-3 items-start ${!n.isRead ? 'border-l-4 border-yellow-400 cursor-pointer hover:bg-gray-800/50' : ''} transition-colors`}>
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-yellow-400' : 'bg-transparent'}`} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-white">{n.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
            </div>
            {!n.isRead && (
              <button onClick={(e) => { e.stopPropagation(); markRead(n._id); }} className="text-xs text-yellow-400 hover:text-yellow-300 font-medium flex-shrink-0 mt-1">
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesTab() {
  const { user } = useAuth();
  const { data: conversations, isLoading: convsLoading } = useGetConversationsQuery();
  const [selectedConv, setSelectedConv] = useState(null);
  const [showMobileList, setShowMobileList] = useState(true);

  const selectedConvData = selectedConv ? conversations?.data?.find(c => c._id === selectedConv) : null;
  const otherParticipant = selectedConvData?.participants?.find(p => p._id !== user?._id);

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">Messages</h2>
      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="flex h-full">
          {/* Conversation List */}
          <div className={`w-full md:w-72 border-r border-gray-800 flex-shrink-0 ${showMobileList ? 'block' : 'hidden md:block'}`}>
            <div className="p-3 border-b border-gray-800">
              <input placeholder="Search conversations..." className="input-field py-1.5 text-sm" />
            </div>
            <div className="overflow-y-auto h-[calc(100%-53px)]">
              {convsLoading ? (
                <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
              ) : conversations?.data?.length === 0 ? (
                <div className="p-8 text-center">
                  <FaComments size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No conversations yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start by messaging a driver from your bookings</p>
                </div>
              ) : conversations?.data?.map((conv) => {
                const other = conv.participants?.find(p => p._id !== user?._id);
                const isActive = selectedConv === conv._id;
                return (
                  <button
                    key={conv._id}
                    onClick={() => { setSelectedConv(conv._id); setShowMobileList(false); }}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-gray-800/50 ${isActive ? 'bg-yellow-400/10' : ''}`}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-yellow-900/30">
                      {getInitials(other?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white truncate">{other?.name}</p>
                      {conv.lastMessage && (
                        <p className="text-xs text-gray-400 truncate">{conv.lastMessage?.content}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!showMobileList ? 'block' : 'hidden md:flex'}`}>
            {selectedConv ? (
              <ChatView
                conversationId={selectedConv}
                otherParticipant={otherParticipant}
                currentUser={user}
                onBack={() => { setSelectedConv(null); setShowMobileList(true); }}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FaComments size={48} className="text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatView({ conversationId, otherParticipant, currentUser, onBack }) {
  const { data: messages, isLoading } = useGetMessagesQuery(conversationId);
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.emit('joinRoom', conversationId);
      socketRef.current = socket;
      const handler = () => {
        // triggers refetch by invalidating tags
      };
      socket.on('receiveMessage', handler);
      return () => {
        socket.emit('leaveRoom', conversationId);
        socket.off('receiveMessage', handler);
      };
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    try {
      await sendMessage({ conversationId, content: text.trim() }).unwrap();
      setText('');
    } catch {
      toast.error('Failed to send message');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMsgTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-800 bg-gray-900">
        <button onClick={onBack} className="md:hidden p-1 hover:bg-gray-800 rounded-lg">
          <FaArrowLeft size={16} className="text-gray-500" />
        </button>
        <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-yellow-900/30">
          {getInitials(otherParticipant?.name)}
        </div>
        <p className="font-semibold text-sm text-white flex-1">{otherParticipant?.name || 'Unknown'}</p>
        <button onClick={() => {
          if (window.confirm('Delete this conversation?')) {
            axiosInstance.delete(`/messages/conversations/${conversationId}`).then(() => { onBack(); toast.success('Conversation deleted'); }).catch(() => toast.error('Failed to delete'));
          }
        }} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Delete conversation">
          <FaTrash size={13} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-950">
        {isLoading ? (
          <div className="text-center text-gray-400 text-sm py-8">Loading messages...</div>
        ) : messages?.data?.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">No messages yet. Say hello!</div>
        ) : messages?.data?.map((msg) => {
          const isMine = msg.sender?._id === currentUser?._id;
          return (
            <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
                isMine
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-br-md'
                  : 'bg-white dark:bg-gray-800 text-white border border-gray-100 dark:border-gray-700 rounded-bl-md'
              }`}>
                <p className="break-words">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMine ? 'text-yellow-200' : 'text-gray-400'}`}>
                  {formatMsgTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-800 bg-gray-900">
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="input-field py-2 text-sm flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 disabled:bg-gray-600 text-black rounded-xl flex items-center justify-center transition-colors shadow-md shadow-yellow-900/30"
          >
            <FaPaperPlane size={14} />
          </button>
        </div>
      </div>
    </>
  );
}

function PaymentsTab() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">Payment History</h2>
      <div className="card p-10 text-center">
        <FaCreditCard size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No payment history yet</p>
      </div>
    </div>
  );
}
