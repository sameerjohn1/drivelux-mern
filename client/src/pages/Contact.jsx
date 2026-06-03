import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  const INFO = [
    { icon: FaPhone, title: 'Phone', lines: ['+92 300 123 4567', '+92 301 987 6543'] },
    { icon: FaEnvelope, title: 'Email', lines: ['support@drivelux.com', 'info@drivelux.com'] },
    { icon: FaMapMarkerAlt, title: 'Locations', lines: ['Lahore · Karachi · Islamabad', 'More cities coming soon'] },
    { icon: FaClock, title: 'Support Hours', lines: ['Mon-Fri: 8am – 10pm', 'Sat-Sun: 9am – 8pm'] },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-3">Contact Us</h1>
          <p className="text-gray-400">We're here to help. Reach out anytime.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
          {INFO.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-5 text-center">
              <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center mx-auto mb-3 shadow-md shadow-yellow-900/30">
                <item.icon size={18} />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1.5">{item.title}</h3>
              {item.lines.map((l, j) => <p key={j} className="text-xs text-gray-400">{l}</p>)}
            </motion.div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Your name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="How can we help?" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" placeholder="Tell us more..." required />
              </div>
              <Button type="submit" loading={loading} className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
