import React from 'react';
import { motion } from 'motion/react';
import { TutorDetail } from '../services/api';
import { formatRating } from '../utils/validation';
import { Star, ArrowRight, DollarSign, Award, BookOpen } from 'lucide-react';

interface TutorCardProps {
  tutor: TutorDetail;
  onViewProfile: (tutor: TutorDetail) => void;
  badge?: string;
  rank?: number;
}

export const TutorCard: React.FC<TutorCardProps> = ({ tutor, onViewProfile, badge, rank }) => {
  const name = `${tutor.first_name} ${tutor.last_name}`;
  const avatar = tutor.profile_picture_url || '/images/users/1.jpg';
  const rating = tutor.average_rating || 0;
  const reviewsCount = tutor.total_reviews || 0;
  const rate = tutor.hourly_rate ? `$${tutor.hourly_rate}` : 'Inquire';

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative flex flex-col rounded-3xl bg-[#0F121E] border border-white/[0.08] hover:border-violet-500/50 shadow-xl hover:shadow-[0_20px_45px_rgba(124,58,237,0.18)] transition-all duration-300 overflow-hidden"
    >
      {/* Glow highlight on top */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Card Header & Media */}
      <div className="relative h-56 bg-[#161B2E] overflow-hidden">
        <img
          src={avatar}
          alt={name}
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
          }}
          className="w-full h-full object-cover object-top filter brightness-95 group-hover:scale-105 group-hover:brightness-105 transition-all duration-700"
        />
        {/* Soft bottom image shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F121E] via-[#0F121E]/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
          {badge ? (
            <span className="px-3 py-1 rounded-xl bg-violet-600/90 text-white text-[11px] font-mono-accent font-bold uppercase tracking-wider shadow-lg backdrop-blur-md border border-white/20">
              {badge}
            </span>
          ) : rank ? (
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/90 text-slate-950 text-[11px] font-mono-accent font-black tracking-wider shadow-lg backdrop-blur-md">
              RANK #{rank}
            </span>
          ) : <div />}

          {/* Rate Badge */}
          <div className="px-3 py-1 rounded-xl bg-black/60 text-emerald-400 border border-emerald-500/30 backdrop-blur-md flex items-center gap-1 font-mono-accent font-bold text-xs">
            <span>{rate}</span>
            <span className="text-[10px] text-slate-400">/hr</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Name & Rating */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display font-extrabold text-xl text-white group-hover:text-violet-300 transition-colors">
                {name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                {tutor.education || 'Verified Educator'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono-accent font-bold text-xs">{formatRating(rating)}</span>
              {reviewsCount > 0 && (
                <span className="text-[10px] text-amber-300/70">({reviewsCount})</span>
              )}
            </div>
          </div>

          {/* Bio snippet */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-light">
            {tutor.bio || 'Expert tutor committed to student growth, concept mastery, and academic excellence.'}
          </p>

          {/* Subject Metadata (Zero-pill discipline with clean typographic separation) */}
          <div className="pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 flex-wrap">
              <BookOpen className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              {tutor.subjects && tutor.subjects.length > 0 ? (
                tutor.subjects.slice(0, 3).map((subj, idx) => (
                  <React.Fragment key={idx}>
                    <span className="font-medium text-violet-200">{subj}</span>
                    {idx < Math.min(tutor.subjects.length - 1, 2) && (
                      <span className="text-white/20" aria-hidden="true">·</span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span className="italic text-slate-400">General Academics</span>
              )}
              {tutor.subjects && tutor.subjects.length > 3 && (
                <span className="text-[11px] font-mono-accent text-slate-400 font-semibold">
                  +{tutor.subjects.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <div className="text-[11px] font-mono-accent text-slate-400 uppercase tracking-wider">
            {tutor.availability ? 'FLEXIBLE HOURS' : 'AVAILABLE NOW'}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewProfile(tutor)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-violet-600/30 transition cursor-pointer"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
