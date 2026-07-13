import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Calendar, DollarSign, SlidersHorizontal, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import type { EventItem } from '../components/EventCard';

interface CategoryItem {
  id: number;
  name: string;
  description: string;
}

const Events: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for loaded events
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters read from URL or state
  const queryParam = searchParams.get('query') || '';
  const categoryParam = searchParams.get('categoryId') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const sortByParam = searchParams.get('sortBy') || 'date';
  const sortDirParam = searchParams.get('sortDir') || 'asc';
  
  // Local temporary filter states (submitted on clicking Apply)
  const [localQuery, setLocalQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState(sortByParam);
  const [sortDir, setSortDir] = useState(sortDirParam);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch events based on current searchParams
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pageParam,
        size: 8,
        sortBy: searchParams.get('sortBy') || 'date',
        sortDir: searchParams.get('sortDir') || 'asc',
      };
      
      const q = searchParams.get('query');
      if (q) params.query = q;
      
      const cat = searchParams.get('categoryId');
      if (cat) params.categoryId = cat;
      
      const sd = searchParams.get('startDate');
      if (sd) params.startDate = sd;
      
      const ed = searchParams.get('endDate');
      if (ed) params.endDate = ed;
      
      const price = searchParams.get('maxPrice');
      if (price) params.maxPrice = price;

      const loc = searchParams.get('location');
      if (loc) params.location = loc;

      const res = await api.get('/api/events', { params });
      setEvents(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchParams]);

  // Synchronize local states when URL params change (e.g. from hero search)
  useEffect(() => {
    setLocalQuery(queryParam);
    setSelectedCategory(categoryParam);
  }, [queryParam, categoryParam]);

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const newParams: any = { page: 0 }; // Reset to page 0
    if (localQuery) newParams.query = localQuery;
    if (selectedCategory) newParams.categoryId = selectedCategory;
    if (startDate) newParams.startDate = startDate;
    if (endDate) newParams.endDate = endDate;
    if (maxPrice !== '') newParams.maxPrice = String(maxPrice);
    if (location) newParams.location = location;
    
    newParams.sortBy = sortBy;
    newParams.sortDir = sortDir;

    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setLocalQuery('');
    setSelectedCategory('');
    setStartDate('');
    setEndDate('');
    setMaxPrice('');
    setLocation('');
    setSortBy('date');
    setSortDir('asc');
    setSearchParams({});
  };

  const handlePageChange = (newPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    setSearchParams(nextParams);
  };

  const handleSortChange = (property: string) => {
    let nextDir = 'asc';
    if (sortBy === property && sortDir === 'asc') {
      nextDir = 'desc';
    }
    setSortBy(property);
    setSortDir(nextDir);
    
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sortBy', property);
    nextParams.set('sortDir', nextDir);
    setSearchParams(nextParams);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold font-outfit text-white">Explore Events</h1>
        <p className="text-sm text-slate-400">Discover upcoming and popular events worldwide</p>
      </div>

      {/* Main Grid: Filters Sidebar + Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                Filters
              </h2>
              <button
                onClick={handleClearFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Clear all
              </button>
            </div>

            <form onSubmit={handleApplyFilters} className="space-y-5">
              {/* Search */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search</label>
                <div className="flex items-center p-2.5 rounded-xl border border-slate-800 bg-slate-950 focus-within:border-indigo-500/50 transition-all">
                  <Search className="w-4 h-4 text-slate-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Keywords..."
                    className="w-full bg-transparent border-0 outline-none focus:ring-0 text-xs text-slate-200"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <select
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 focus:border-indigo-500/50 text-xs text-slate-300 outline-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Range</label>
                <div className="flex items-center p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                  <input
                    type="date"
                    className="bg-transparent border-0 outline-none focus:ring-0 w-full text-slate-300"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex items-center p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                  <input
                    type="date"
                    className="bg-transparent border-0 outline-none focus:ring-0 w-full text-slate-300"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Location filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</label>
                <div className="flex items-center p-2.5 rounded-xl border border-slate-800 bg-slate-950 focus-within:border-indigo-500/50 transition-all">
                  <MapPin className="w-4 h-4 text-slate-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Venue / City..."
                    className="w-full bg-transparent border-0 outline-none focus:ring-0 text-xs text-slate-200"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Max Price */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max Price ($)</label>
                <div className="flex items-center p-2.5 rounded-xl border border-slate-800 bg-slate-950 focus-within:border-indigo-500/50 transition-all">
                  <DollarSign className="w-4 h-4 text-slate-500 mr-1" />
                  <input
                    type="number"
                    placeholder="Budget limit"
                    className="w-full bg-transparent border-0 outline-none focus:ring-0 text-xs text-slate-200"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Events list */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting panel */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-900 bg-slate-950/40">
            <span className="text-xs text-slate-400">
              Showing {events.length} event{events.length !== 1 && 's'}
            </span>
            
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500">Sort by:</span>
              <button
                onClick={() => handleSortChange('date')}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  sortBy === 'date'
                    ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-semibold'
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Date {sortBy === 'date' && (sortDir === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSortChange('price')}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  sortBy === 'price'
                    ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-semibold'
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Price {sortBy === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSortChange('popularity')}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  sortBy === 'popularity'
                    ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-semibold'
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Popularity
              </button>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 rounded-2xl bg-slate-900 animate-pulse border border-slate-800"></div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="glass-panel rounded-3xl p-16 text-center space-y-3">
              <p className="text-slate-400 font-semibold text-lg">No events found matching filters.</p>
              <button
                onClick={handleClearFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold border border-indigo-500/20 px-4 py-2 rounded-xl hover:bg-indigo-500/5 transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                onClick={() => handlePageChange(pageParam - 1)}
                disabled={pageParam === 0}
                className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-xs text-slate-400 font-medium">
                Page {pageParam + 1} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pageParam + 1)}
                disabled={pageParam === totalPages - 1}
                className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Events;
