import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Sparkles, TrendingUp, Award } from 'lucide-react';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import type { EventItem } from '../components/EventCard';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [popularEvents, setPopularEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [upcomingRes, popularRes] = await Promise.all([
          api.get('/api/events/upcoming'),
          api.get('/api/events/popular?limit=3')
        ]);
        setUpcomingEvents(upcomingRes.data);
        setPopularEvents(popularRes.data);
      } catch (err) {
        console.error('Failed to load home page events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?query=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/events');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Discover what's happening next
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-outfit text-white leading-tight">
            Connecting People through <br />
            <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              Unforgettable Events
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-slate-400 text-base md:text-lg">
            SmartEvents is the ultimate workspace to book, host, manage, and review tech workshops, conferences, sports, concerts, and festivals. Get instant email tickets with verified QR codes.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mx-auto max-w-xl flex items-center p-2 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-lg shadow-indigo-600/5 focus-within:border-indigo-500/50 transition-all duration-300">
            <Search className="w-5 h-5 text-slate-500 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search by event title, category, venue..."
              className="w-full bg-transparent border-0 outline-none focus:ring-0 text-sm text-slate-200 px-3 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Popular Events Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-outfit">
              <TrendingUp className="w-6 h-6 text-indigo-500" />
              Popular Right Now
            </h2>
            <Link to="/events" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-72 rounded-2xl bg-slate-900 animate-pulse border border-slate-800"></div>
              ))}
            </div>
          ) : popularEvents.length === 0 ? (
            <p className="text-slate-500 text-sm py-4">No events found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 rounded-3xl border border-slate-900 bg-slate-950/40">
          <div className="space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-100 font-outfit">Verified Entry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every ticket generates a cryptographically signed QR code. Admins can scan QR codes instantly at the gate to verify ticket authenticity.
            </p>
          </div>
          <div className="space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-100 font-outfit">Automated Email Reminders</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never forget an event. Our system automatically schedules HTML emails with ticket PDFs and sends automated notifications 24 hours before event starts.
            </p>
          </div>
          <div className="space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-100 font-outfit">Verified Reviews</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensure high quality feedback. Only users who have booked and attended the event are allowed to submit rating stars and write reviews.
            </p>
          </div>
        </section>

        {/* Upcoming Events Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-outfit">
              <Calendar className="w-6 h-6 text-indigo-500" />
              Upcoming Events
            </h2>
            <Link to="/events" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-72 rounded-2xl bg-slate-900 animate-pulse border border-slate-800"></div>
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <p className="text-slate-500 text-sm py-4">No events found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
