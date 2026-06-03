import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function Rating({ value = 0, count, size = 'sm', interactive = false, onChange }) {
  const stars = [1, 2, 3, 4, 5];
  const sz = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';

  return (
    <div className="flex items-center gap-1">
      <div className={`flex items-center gap-0.5 ${sz}`}>
        {stars.map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={() => interactive && onChange?.(star)}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          >
            {value >= star ? (
              <FaStar className="text-amber-400" />
            ) : value >= star - 0.5 ? (
              <FaStarHalfAlt className="text-amber-400" />
            ) : (
              <FaRegStar className="text-gray-300" />
            )}
          </button>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-gray-500 dark:text-gray-400 text-xs">({count})</span>
      )}
    </div>
  );
}
