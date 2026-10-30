import React from 'react';
import { TutorDetail } from '../services/api';
import { formatRating } from '../utils/validation';
import { Star, DollarSign } from 'lucide-react';

interface TutorCardProps {
  tutor: TutorDetail;
  onViewProfile: (tutor: TutorDetail) => void;
  badge?: string;
}

export const TutorCard: React.FC<TutorCardProps> = ({ tutor, onViewProfile, badge }) => {
  const name = `${tutor.first_name} ${tutor.last_name}`;
  const avatar = tutor.profile_picture_url || '/images/users/1.jpg';
  const rating = tutor.average_rating || 0;
  const reviewsCount = tutor.total_reviews || 0;
  const rate = tutor.hourly_rate ? `$${tutor.hourly_rate} / hr` : 'Rate on request';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-300 flex flex-col overflow-hidden group">
      {/* Card Header & Avatar */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img
          src={avatar}
          alt={name}
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition">
              {name}
            </h3>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-semibold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{formatRating(rating)}</span>
              {reviewsCount > 0 && <span className="text-slate-400 font-normal">({reviewsCount})</span>}
            </div>
          </div>

          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
            {tutor.bio || 'Experienced educator focused on personalized instruction.'}
          </p>

          {/* Subjects */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tutor.subjects && tutor.subjects.length > 0 ? (
              tutor.subjects.slice(0, 3).map((subj, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md"
                >
                  {subj}
                </span>
              ))
            ) : (
              <span className="text-xs font-medium text-slate-400 italic">General Tutoring</span>
            )}
            {tutor.subjects && tutor.subjects.length > 3 && (
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                +{tutor.subjects.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 font-bold text-slate-800 text-sm">
            <DollarSign className="w-4 h-4 text-emerald-600 -mr-1" />
            <span>{rate}</span>
          </div>

          <button
            onClick={() => onViewProfile(tutor)}
            className="px-4 py-2 text-xs font-semibold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};
