import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUsers, FaGasPump, FaCog, FaCalendarAlt, FaCheckCircle, FaHeart, FaShare } from 'react-icons/fa';
import { useGetCarQuery, useGetReviewsQuery, useCreateBookingMutation, useAddToWishlistMutation } from '../store/api/apiSlice';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Rating from '../components/ui/Rating';
import Loader from '../components/ui/Loader';
import { formatPrice, formatDate, calcDays } from '../utils/helpers';

export default function CarDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { data: carData, isLoading } = useGetCarQuery(id);
  const { data: reviewsData } = useGetReviewsQuery(id);
  const [createBooking, { isLoading: booking }] = useCreateBookingMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [activeImg, setActiveImg] = useState(0);
  const [bookingForm, setBookingForm] = useState({ startDate: '', endDate: '', pickupLocation: { address: '', city: '' }, dropoffLocation: { address: '', city: '' }, paymentMethod: 'cash' });

  if (isLoading) return <Loader />;
  const car = carData?.data;
  if (!car) return <div className="text-center py-20 text-gray-400">Car not found.</div>;

  const totalDays = bookingForm.startDate && bookingForm.endDate ? calcDays(bookingForm.startDate, bookingForm.endDate) : 0;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to book'); return; }
    try {
      await createBooking({ carId: id, ...bookingForm }).unwrap();
      toast.success('Booking created successfully!');
    } catch (err) {
      toast.error(err?.data?.message || 'Booking failed');
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return; }
    try { await addToWishlist(id).unwrap(); toast.success('Added to wishlist!'); } catch (err) { toast.error(err?.data?.message || 'Error'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-yellow-400">Home</Link>
        <span>/</span>
        <Link to="/cars" className="hover:text-yellow-400">Cars</Link>
        <span>/</span>
        <span className="text-white font-medium">{car.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Image & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="card overflow-hidden">
            <div className="relative h-80">
              <img src={car.images?.[activeImg]?.url || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800'} alt={car.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={handleWishlist} className="p-2 bg-gray-800/90 rounded-full hover:bg-gray-700 transition-colors">
                  <FaHeart className="text-red-500" size={16} />
                </button>
                <button className="p-2 bg-gray-800/90 rounded-full hover:bg-gray-700 transition-colors">
                  <FaShare className="text-gray-400" size={16} />
                </button>
              </div>
            </div>
            {car.images?.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {car.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-yellow-400' : 'border-transparent'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{car.name}</h1>
                <p className="text-gray-400">{car.brand} · {car.model} · {car.year}</p>
              </div>
              <Rating value={car.rating} count={car.totalRatings} size="md" />
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-5">
              <FaMapMarkerAlt size={13} className="text-yellow-400" />
              <span className="text-sm">{car.location?.city}, {car.location?.country}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 p-4 bg-gray-800 rounded-xl">
              {[
                { icon: FaUsers, label: 'Seats', value: car.seats },
                { icon: FaGasPump, label: 'Fuel', value: car.fuelType },
                { icon: FaCog, label: 'Transmission', value: car.transmission },
                { icon: FaCalendarAlt, label: 'Year', value: car.year },
              ].map((spec, i) => (
                <div key={i} className="text-center">
                  <spec.icon className="mx-auto text-yellow-400 mb-1" size={18} />
                  <p className="text-xs text-gray-400">{spec.label}</p>
                  <p className="font-semibold text-sm capitalize text-white">{spec.value}</p>
                </div>
              ))}
            </div>
            {car.description && (
              <div className="mb-5">
                <h3 className="font-semibold text-white mb-2">Description</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{car.description}</p>
              </div>
            )}
            {car.features?.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((f, i) => (
                    <span key={i} className="flex items-center gap-1 bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 text-xs px-3 py-1 rounded-full">
                      <FaCheckCircle size={10} /> {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="card p-6">
            <h3 className="font-bold text-white text-lg mb-4">
              Reviews {reviewsData?.data?.length > 0 ? `(${reviewsData.data.length})` : ''}
            </h3>

            {/* Review Form */}
            {isAuthenticated ? (
              <div className="mb-6 p-4 bg-gray-800/50 rounded-xl text-center">
                <p className="text-sm text-gray-400">
                  Book this car and leave a review from your <Link to="/dashboard" className="text-yellow-400 font-medium">Bookings</Link> page.
                </p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gray-800/50 rounded-xl text-center">
                <p className="text-sm text-gray-400">
                  <Link to="/login" className="text-yellow-400 font-medium">Sign in</Link> to book and review
                </p>
              </div>
            )}

            {/* Existing Reviews */}
            {reviewsData?.data?.length > 0 ? (
              <div className="space-y-4">
                {reviewsData.data.slice(0, 5).map((review) => (
                  <div key={review._id} className="border-b border-gray-800 pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-sm font-bold shadow-md shadow-yellow-900/30">
                        {review.user?.name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-white">{review.user?.name}</p>
                        <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                      </div>
                      <Rating value={review.rating} size="sm" />
                    </div>
                    {review.title && <p className="font-medium text-sm mb-1 text-gray-200">{review.title}</p>}
                    <p className="text-sm text-gray-400">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No reviews yet. Be the first!</p>
            )}
          </div>
        </div>

        {/* Right - Booking Form */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <div className="mb-4">
              <span className="text-3xl font-bold text-yellow-400">{formatPrice(car.pricePerDay)}</span>
              <span className="text-gray-400 text-sm">/day</span>
            </div>
            {!car.isAvailable ? (
              <div className="bg-yellow-900/20 text-yellow-400 p-3 rounded-xl text-sm text-center">Currently Unavailable</div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Pickup Date</label>
                  <input type="date" min={new Date().toISOString().split('T')[0]} value={bookingForm.startDate} onChange={(e) => setBookingForm({ ...bookingForm, startDate: e.target.value })} className="input-field text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Return Date</label>
                  <input type="date" min={bookingForm.startDate || new Date().toISOString().split('T')[0]} value={bookingForm.endDate} onChange={(e) => setBookingForm({ ...bookingForm, endDate: e.target.value })} className="input-field text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Pickup Location</label>
                  <input type="text" placeholder="Enter pickup address" value={bookingForm.pickupLocation.address} onChange={(e) => setBookingForm({ ...bookingForm, pickupLocation: { ...bookingForm.pickupLocation, address: e.target.value } })} className="input-field text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Payment Method</label>
                  <select value={bookingForm.paymentMethod} onChange={(e) => setBookingForm({ ...bookingForm, paymentMethod: e.target.value })} className="input-field text-sm">
                    <option value="cash">Cash on Pickup</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="easypaisa">EasyPaisa</option>
                    <option value="stripe">Credit/Debit Card</option>
                  </select>
                </div>
                {totalDays > 0 && (
                  <div className="bg-gray-800 p-3 rounded-xl space-y-1 text-sm">
                    <div className="flex justify-between text-gray-400"><span>{totalDays} day(s) × {formatPrice(car.pricePerDay)}</span><span>{formatPrice(totalDays * car.pricePerDay)}</span></div>
                    <div className="flex justify-between font-bold text-white border-t border-gray-700 pt-1 mt-1">
                      <span>Total</span><span className="text-yellow-400">{formatPrice(totalDays * car.pricePerDay)}</span>
                    </div>
                  </div>
                )}
                <button type="submit" disabled={booking || !isAuthenticated} className="btn-primary w-full">
                  {booking ? 'Booking...' : !isAuthenticated ? 'Login to Book' : 'Confirm Booking'}
                </button>
                {!isAuthenticated && (
                  <p className="text-center text-xs text-gray-400">
                    <Link to="/login" className="text-yellow-400 font-medium">Sign in</Link> to book this car
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
