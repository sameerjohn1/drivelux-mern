import { motion } from 'framer-motion';
import { FaUsers, FaCar, FaStar, FaShieldAlt } from 'react-icons/fa';

const TEAM = [
  { name: 'Ahmed Khan', role: 'CEO & Founder', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'Sara Ali', role: 'CTO', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
  { name: 'Bilal Hussain', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
  { name: 'Fatima Noor', role: 'Marketing Lead', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-extrabold mb-4">About DriveLux</h1>
            <p className="text-xl text-primary-100">Pakistan's most trusted car rental platform, connecting travelers with the perfect vehicle since 2021.</p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We believe everyone deserves reliable, affordable transportation. Our platform connects car owners and drivers with travelers across Pakistan, creating economic opportunities while delivering exceptional travel experiences.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              From budget-friendly economy cars to luxury sedans and family SUVs — we have the right vehicle for every journey, every budget, and every occasion.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FaCar, value: '500+', label: 'Vehicles', color: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' },
              { icon: FaUsers, value: '10K+', label: 'Customers', color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
              { icon: FaStar, value: '4.8★', label: 'Avg Rating', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' },
              { icon: FaShieldAlt, value: '100%', label: 'Insured', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`card p-5 text-center ${item.color}`}>
                <item.icon size={28} className="mx-auto mb-2" />
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 dark:bg-gray-950 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Meet Our Team</h2>
            <p className="text-gray-500 dark:text-gray-400">Passionate people building Pakistan's best car rental experience</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-5 text-center">
                <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3" />
                <p className="font-bold text-gray-900 dark:text-white text-sm">{member.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
