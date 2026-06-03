import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaUsers, FaGasPump, FaCog } from "react-icons/fa";
import Rating from "./Rating";
import { formatPrice } from "../../utils/helpers";

export default function CarCard({ car, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card overflow-hidden group hover:shadow-lg transition-shadow duration-300"
    >
      <Link to={`/cars/${car._id}`}>
        <div className="relative overflow-hidden h-48">
          <img
            src={
              car.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800"
            }
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className="badge bg-yellow-400 hover:bg-yellow-300 text-white capitalize">
              {car.category}
            </span>
          </div>
          {!car.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Unavailable</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <Link
              to={`/cars/${car._id}`}
              className="font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-1"
            >
              {car.name}
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {car.brand} · {car.year}
            </p>
          </div>
          <Rating value={car.rating} count={car.totalRatings} />
        </div>
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-xs mb-3">
          <span className="flex items-center gap-1">
            <FaUsers size={10} /> {car.seats} seats
          </span>
          <span className="flex items-center gap-1">
            <FaGasPump size={10} /> {car.fuelType}
          </span>
          <span className="flex items-center gap-1">
            <FaCog size={10} /> {car.transmission}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-4">
          <FaMapMarkerAlt size={10} />
          <span>{car.location?.city}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-yellow-400 hover:text-yellow-300">
              {formatPrice(car.pricePerDay)}
            </span>
            <span className="text-gray-400 text-xs">/day</span>
          </div>
          <Link
            to={`/cars/${car._id}`}
            className="btn-primary text-sm py-1.5 px-4"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
