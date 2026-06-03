import { motion } from 'framer-motion';

export default function Loader({ size = 'lg', text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className={`rounded-full border-4 border-gray-700 border-t-yellow-400 ${size === 'lg' ? 'w-12 h-12' : 'w-6 h-6'}`}
      />
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );
}
