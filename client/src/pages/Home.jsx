import { lazy, Suspense, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaCarSide,
  FaHeadset,
  FaCheckCircle,
} from "react-icons/fa";
import {
  useGetFeaturedCarsQuery,
  useGetPopularCarsQuery,
} from "../store/api/apiSlice";
import { SkeletonCard } from "../components/ui/Skeleton";
import CarCard from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

const STATS = [
  { label: "Cars Available", value: "500+" },
  { label: "Happy Customers", value: "10K+" },
  { label: "Cities Covered", value: "20+" },
  { label: "Years Experience", value: "5+" },
];

const WHY_ITEMS = [
  {
    icon: FaShieldAlt,
    title: "Fully Insured",
    desc: "All vehicles covered with comprehensive insurance",
  },
  {
    icon: FaStar,
    title: "Top Rated Drivers",
    desc: "Verified professional drivers with excellent reviews",
  },
  {
    icon: FaCarSide,
    title: "Premium Fleet",
    desc: "Latest models maintained to highest standards",
  },
  {
    icon: FaHeadset,
    title: "24/7 Support",
    desc: "Round-the-clock customer service for peace of mind",
  },
];

const HOW_STEPS = [
  {
    step: "01",
    title: "Search & Browse",
    desc: "Find the perfect car using our advanced filters",
  },
  {
    step: "02",
    title: "Book & Pay",
    desc: "Secure booking with multiple payment options",
  },
  {
    step: "03",
    title: "Pick Up & Drive",
    desc: "Get the keys and start your journey",
  },
];

const TESTIMONIALS = [
  {
    name: "Zara S.",
    city: "Lahore",
    rating: 5,
    text: "Amazing experience! The car was spotless and the driver was super professional. Will definitely book again.",
  },
  {
    name: "Hamza M.",
    city: "Karachi",
    rating: 5,
    text: "Best car rental service in Pakistan. Smooth booking process and great vehicles at competitive prices.",
  },
  {
    name: "Fatima N.",
    city: "Islamabad",
    rating: 4,
    text: "Really happy with the service. The app is easy to use and the cars are always well-maintained.",
  },
];

const FAQS = [
  {
    q: "How do I book a car?",
    a: 'Browse our fleet, select your dates, click "Book Now" and complete the payment. Confirmation is instant.',
  },
  {
    q: "What documents are required?",
    a: "You need a valid CNIC, driving license, and a credit/debit card for the security deposit.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes, free cancellation up to 24 hours before pickup. After that, a small fee may apply.",
  },
  {
    q: "Do you offer airport transfers?",
    a: "Yes! We offer airport pickup and drop-off services in all major cities.",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-yellow-400/10 text-yellow-300 text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-yellow-400/30">
              Pakistan's #1 Car Rental Platform
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Drive Your Dream Car <span className="text-amber-400">Today</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Choose from 500+ premium vehicles. Transparent pricing,
              professional drivers, instant booking — available across 20+
              cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/cars"
                className="btn-primary text-base py-3 px-8"
              >
                Browse Cars
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="btn-outline border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-base py-3 px-8"
                >
                  Get Started Free
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="btn-outline border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-base py-3 px-8"
                >
                  My Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-950 border-b border-yellow-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-extrabold text-yellow-400">
                  {s.value}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <FeaturedSection />

      {/* Why Choose Us */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Why Choose DriveLux?</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              We make car rental simple, transparent and trustworthy.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-900/30">
                  <item.icon size={24} />
                </div>
                <h3 className="font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cars */}
      <PopularSection />

      {/* How It Works */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">How It Works</h2>
            <p className="text-gray-400">
              Book your car in 3 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-6xl font-extrabold text-yellow-500/30 mb-2">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FaStar key={j} className="text-amber-400" size={14} />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-sm font-bold shadow-md shadow-yellow-900/30">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-5"
              >
                <div className="flex items-start gap-3">
                  <FaCheckCircle
                    className="text-yellow-500 mt-0.5 flex-shrink-0"
                    size={16}
                  />
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      {faq.q}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Hit the Road?</h2>
            <p className="text-gray-400 text-lg mb-8">
              Join 10,000+ customers who trust DriveLux for their travels.
            </p>
            <Link
              to="/cars"
              className="btn-primary text-lg py-4 px-10"
            >
              Find Your Car Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const FeaturedSection = memo(function FeaturedSection() {
  const { data, isLoading } = useGetFeaturedCarsQuery();
  return (
    <section className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Featured Cars</h2>
          <Link
            to="/cars"
            className="text-yellow-400 hover:text-yellow-300 font-medium text-sm"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : data?.data?.map((car, i) => (
                <CarCard key={car._id} car={car} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
});

const PopularSection = memo(function PopularSection() {
  const { data, isLoading } = useGetPopularCarsQuery();
  return (
    <section className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Popular Cars</h2>
          <Link
            to="/cars"
            className="text-yellow-400 hover:text-yellow-300 font-medium text-sm"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : data?.data
                ?.slice(0, 8)
                .map((car, i) => <CarCard key={car._id} car={car} index={i} />)}
        </div>
      </div>
    </section>
  );
});
