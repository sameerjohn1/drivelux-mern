import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaTimes, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCarsQuery } from '../store/api/apiSlice';
import { setFilters, clearFilters, setSearchQuery, setSortBy, setCurrentPage } from '../store/slices/carSlice';
import CarCard from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';
import Pagination from '../components/ui/Pagination';
import { debounce, CAR_CATEGORIES, FUEL_TYPES, TRANSMISSION_TYPES } from '../utils/helpers';

const BRANDS = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Suzuki', 'Hyundai', 'KIA', 'Audi'];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'pricePerDay', label: 'Price: Low to High' },
  { value: '-pricePerDay', label: 'Price: High to Low' },
  { value: '-rating', label: 'Top Rated' },
  { value: '-totalBookings', label: 'Most Popular' },
];

export default function Cars() {
  const dispatch = useDispatch();
  const { filters, searchQuery, sortBy, currentPage } = useSelector((s) => s.cars);
  const [showFilters, setShowFilters] = useState(false);

  const queryParams = useMemo(() => {
    const params = { page: currentPage, limit: 12, sort: sortBy };
    if (searchQuery) params.search = searchQuery;
    if (filters.brand) params.brand = filters.brand;
    if (filters.category) params.category = filters.category;
    if (filters.fuelType) params.fuelType = filters.fuelType;
    if (filters.transmission) params.transmission = filters.transmission;
    if (filters.minPrice) params['pricePerDay[gte]'] = filters.minPrice;
    if (filters.maxPrice) params['pricePerDay[lte]'] = filters.maxPrice;
    if (filters.seats) params.seats = filters.seats;
    if (filters.city) params['location.city'] = filters.city;
    return params;
  }, [filters, searchQuery, sortBy, currentPage]);

  const { data, isLoading } = useGetCarsQuery(queryParams);
  const totalPages = data ? Math.ceil(data.total / 12) : 0;

  const debouncedSearch = useCallback(
    debounce((val) => dispatch(setSearchQuery(val)), 400),
    [dispatch]
  );

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Cars</h1>
          {data && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{data.total} cars found</p>}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            <input
              type="text"
              placeholder="Search cars..."
              defaultValue={searchQuery}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
          {/* Sort */}
          <select value={sortBy} onChange={(e) => dispatch(setSortBy(e.target.value))} className="input-field py-2 text-sm w-auto">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {/* Filter Toggle */}
          <button onClick={() => setShowFilters(!showFilters)} className={`relative flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm transition-colors ${showFilters ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <FaFilter size={13} />
            Filters
            {activeFilterCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{activeFilterCount}</span>}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
            {activeFilterCount > 0 && (
              <button onClick={() => dispatch(clearFilters())} className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
                <FaTimes size={12} /> Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Brand</label>
              <select value={filters.brand} onChange={(e) => dispatch(setFilters({ brand: e.target.value }))} className="input-field py-1.5 text-sm">
                <option value="">All Brands</option>
                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Category</label>
              <select value={filters.category} onChange={(e) => dispatch(setFilters({ category: e.target.value }))} className="input-field py-1.5 text-sm capitalize">
                <option value="">All Categories</option>
                {CAR_CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fuel Type</label>
              <select value={filters.fuelType} onChange={(e) => dispatch(setFilters({ fuelType: e.target.value }))} className="input-field py-1.5 text-sm">
                <option value="">All Fuel Types</option>
                {FUEL_TYPES.map((f) => <option key={f} value={f} className="capitalize">{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Transmission</label>
              <select value={filters.transmission} onChange={(e) => dispatch(setFilters({ transmission: e.target.value }))} className="input-field py-1.5 text-sm">
                <option value="">All</option>
                {TRANSMISSION_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min Price/Day</label>
              <input type="number" value={filters.minPrice} onChange={(e) => dispatch(setFilters({ minPrice: e.target.value }))} placeholder="PKR" className="input-field py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max Price/Day</label>
              <input type="number" value={filters.maxPrice} onChange={(e) => dispatch(setFilters({ maxPrice: e.target.value }))} placeholder="PKR" className="input-field py-1.5 text-sm" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-4">🚗</p>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No cars found</h3>
          <p className="text-gray-500">Try adjusting your filters or search term.</p>
          <button onClick={() => { dispatch(clearFilters()); dispatch(setSearchQuery('')); }} className="btn-primary mt-4">Clear Filters</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data?.map((car, i) => <CarCard key={car._id} car={car} index={i} />)}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => dispatch(setCurrentPage(p))} />
        </>
      )}
    </div>
  );
}
