import { createSlice } from '@reduxjs/toolkit';

const carSlice = createSlice({
  name: 'cars',
  initialState: {
    filters: { brand: '', category: '', fuelType: '', transmission: '', minPrice: '', maxPrice: '', seats: '', city: '' },
    searchQuery: '',
    sortBy: '-createdAt',
    currentPage: 1,
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; state.currentPage = 1; },
    clearFilters: (state) => { state.filters = { brand: '', category: '', fuelType: '', transmission: '', minPrice: '', maxPrice: '', seats: '', city: '' }; state.currentPage = 1; },
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; state.currentPage = 1; },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    setCurrentPage: (state, action) => { state.currentPage = action.payload; },
  },
});

export const { setFilters, clearFilters, setSearchQuery, setSortBy, setCurrentPage } = carSlice.actions;
export default carSlice.reducer;
