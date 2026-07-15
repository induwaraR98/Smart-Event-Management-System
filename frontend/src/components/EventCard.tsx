import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, Tag } from 'lucide-react';
import { getCleanImageUrl } from '../utils/image';

export interface EventItem {
  id: number;
  title: string;
  description: string;
  category: { id: number; name: string } | null;
  venue: string;
  address: string;
  date: string;
  time: string;
  organizer: string;
  ticketPrice: number;
  totalSeats: number;
  availableSeats: number;
  eventImage: string;
  status: string;
}

interface EventCardProps {
  event: EventItem;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Safe default image URL if none is supplied
  const imageUrl = getCleanImageUrl(event.eventImage) || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&auto=format&fit=crop&q=60';
  
  // Format Date nicely
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'UPCOMING': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ONGOING': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'COMPLETED': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'CANCELLED': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="glass-card group overflow-hidden rounded-2xl border border-slate-800/80 hover:border-indigo-500/30 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
      {/* Event Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={imageUrl}
          alt={event.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&auto=format&fit=crop&q=60';
          }}
        />
        {/* Status Tag */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-wider px-2 py-1 rounded-full border ${getStatusColor(event.status)} uppercase`}>
          {event.status}
        </span>
        {/* Ticket Price */}
        <span className="absolute bottom-3 right-3 text-sm font-bold bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-indigo-400">
          {event.ticketPrice === 0 ? 'Free' : `$${event.ticketPrice.toFixed(2)}`}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-2">
          <Tag className="w-3 h-3" />
          <span>{event.category ? event.category.name : 'Uncategorized'}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-slate-100 line-clamp-1 mb-2 group-hover:text-indigo-400 transition-colors duration-200">
          {event.title}
        </h3>

        {/* Details Row */}
        <div className="space-y-2 mb-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{eventDate} at {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        </div>

        {/* Action Button & Seat Status */}
        <div className="mt-auto pt-4 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">
            {event.availableSeats <= 0 ? (
              <span className="text-red-400 font-semibold">Sold Out</span>
            ) : (
              <span>{event.availableSeats} of {event.totalSeats} seats left</span>
            )}
          </span>
          <Link
            to={`/events/${event.id}`}
            className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
