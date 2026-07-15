import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Image as ImageIcon, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import { getCleanImageUrl } from '../utils/image';

interface CategoryItem {
  id: number;
  name: string;
}

const ManageEvents: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  // Categories list
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form fields state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [ticketPrice, setTicketPrice] = useState(0);
  const [totalSeats, setTotalSeats] = useState(100);
  const [eventImage, setEventImage] = useState('');
  const [status, setStatus] = useState('UPCOMING');

  useEffect(() => {
    // Load categories
    const loadCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();

    // If edit mode, load event details
    if (isEditMode) {
      const loadEventDetails = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/api/events/${id}`);
          const e = res.data;
          setTitle(e.title);
          setDescription(e.description);
          setCategoryId(e.category ? String(e.category.id) : '');
          setVenue(e.venue);
          setAddress(e.address);
          setDate(e.date);
          setTime(e.time);
          setOrganizer(e.organizer);
          setTicketPrice(e.ticketPrice);
          setTotalSeats(e.totalSeats);
          setEventImage(e.eventImage || '');
          setStatus(e.status);
        } catch (err) {
          setError('Failed to load event details.');
        } finally {
          setLoading(false);
        }
      };
      loadEventDetails();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !categoryId || !venue.trim() || !address.trim() || !date || !time || !organizer.trim() || totalSeats <= 0) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    const payload = {
      title,
      description,
      category: { id: Number(categoryId) },
      venue,
      address,
      date,
      time,
      organizer,
      ticketPrice,
      totalSeats,
      eventImage,
      status
    };

    setSubmitLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/api/events/${id}`, payload);
        setToastMessage('Event listing updated successfully!');
      } else {
        await api.post('/api/events', payload);
        setToastMessage('Event listing published successfully!');
      }
      setShowSuccessToast(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save event. Please check inputs.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
      </Link>

      <div className="glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
        <div className="border-b border-slate-800/80 pb-4">
          <h2 className="text-2xl font-extrabold text-white font-outfit">
            {isEditMode ? 'Edit Event Details' : 'Create New Event'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configure event listings, pricing, venue details and parameters</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-300">
          
          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wide">Event Title *</label>
            <input
              type="text"
              placeholder="e.g. NextGen Web Summit"
              className="w-full p-3 rounded-2xl border border-slate-800 bg-slate-900 focus:border-indigo-500/50 outline-none text-slate-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wide">Description *</label>
            <textarea
              rows={5}
              placeholder="Write a descriptive summary of what this event is about..."
              className="w-full p-3 rounded-2xl border border-slate-800 bg-slate-900 focus:border-indigo-500/50 outline-none text-slate-200"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wide">Category *</label>
              <select
                className="w-full p-3 rounded-2xl border border-slate-800 bg-slate-900 focus:border-indigo-500/50 outline-none text-slate-300"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Choose category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Organizer */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wide">Organizer *</label>
              <input
                type="text"
                placeholder="Company or host name"
                className="w-full p-3 rounded-2xl border border-slate-800 bg-slate-900 focus:border-indigo-500/50 outline-none text-slate-200"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Venue and Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wide">Venue Location *</label>
              <input
                type="text"
                placeholder="e.g. Grand Plaza Auditorium"
                className="w-full p-3 rounded-2xl border border-slate-800 bg-slate-900 focus:border-indigo-500/50 outline-none text-slate-200"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wide">Address *</label>
              <input
                type="text"
                placeholder="Street address, city"
                className="w-full p-3 rounded-2xl border border-slate-800 bg-slate-900 focus:border-indigo-500/50 outline-none text-slate-200"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wide">Event Date *</label>
              <input
                type="date"
                className="w-full p-3 rounded-2xl border border-slate-800 bg-slate-900 focus:border-indigo-500/50 outline-none text-slate-300"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wide">Event Time *</label>
              <input
                type="time"
                className="w-full p-3 rounded-2xl border border-slate-800 bg-slate-900 focus:border-indigo-500/50 outline-none text-slate-300"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Pricing, Seats, Image and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wide">Ticket Price ($) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00 (Free)"
                className="w-full p-3 rounded-2xl border border-slate-800 bg-slate-900 focus:border-indigo-500/50 outline-none text-slate-200"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wide">Total Seats *</label>
              <input
                type="number"
                min="1"
                placeholder="100"
                className="w-full p-3 rounded-2xl border border-slate-800 bg-slate-900 focus:border-indigo-500/50 outline-none text-slate-200"
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
                required
              />
            </div>

            {/* Status (Only available in Edit Mode) */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wide">Status</label>
              <select
                className="w-full p-3 rounded-2xl border border-slate-800 bg-slate-900 focus:border-indigo-500/50 outline-none text-slate-300"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={!isEditMode}
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wide">Event Image URL</label>
            <div className="flex items-center p-2.5 rounded-2xl border border-slate-800 bg-slate-900 focus-within:border-indigo-500/50 transition-all">
              <ImageIcon className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                className="w-full bg-transparent border-0 outline-none focus:ring-0 text-slate-200"
                value={eventImage}
                onChange={(e) => setEventImage(e.target.value)}
              />
            </div>
            {eventImage && (
              <div className="mt-2.5 relative aspect-video w-full max-w-xs overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                <img
                  src={getCleanImageUrl(eventImage)}
                  alt="Event Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500';
                  }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] mt-6"
          >
            {submitLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                {isEditMode ? 'Update Event Listing' : 'Publish Event'}
              </>
            )}
          </button>
        </form>
      </div>

      {showSuccessToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 max-w-sm w-full text-center space-y-4 shadow-2xl animate-scale-up">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white font-outfit">Success!</h3>
              <p className="text-xs text-slate-400 font-medium">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
