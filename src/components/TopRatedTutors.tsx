import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api, TutorDetail } from '../services/api';
import { TutorCard } from './TutorCard';
import { Trophy, Sparkles, Flame } from 'lucide-react';

interface TopRatedTutorsProps {
  onViewProfile: (tutor: TutorDetail) => void;
}

export const TopRatedTutors: React.FC<TopRatedTutorsProps> = ({ onViewProfile }) => {
  const [tutors, setTutors] = useState<TutorDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopTutors();
  }, []);

  const loadTopTutors = async () => {
    try {
      const data = await api.getTutors({ top_rated: 1 });
      setTutors(data.slice(0, 3));
    } catch {
      // Handled silently
    } finally {
      setLoading(false);
    }
  };

  if (!loading && tutors.length === 0) return null;

  return (
    <section id="topRatedSection" className="relative py-20 lg:py-24 bg-[#0A0D17] border-b border-white/[0.08] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-b from-amber-500/10 via-violet-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Trophy className="w-4 h-4 fill-amber-400" />
            <span className="text-xs font-mono-accent font-bold uppercase tracking-widest">
              ACADEMIC HALL OF FAME
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Top Rated Educators
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light">
            Recognized for outstanding pupil satisfaction, rigorous methodology, and consistent score acceleration.
          </p>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tutors.map((tutor, idx) => (
              <TutorCard
                key={tutor.user_id}
                tutor={tutor}
                onViewProfile={onViewProfile}
                rank={idx + 1}
                badge={idx === 0 ? '🏆 #1 Top Rated' : idx === 1 ? '⚡ Top Ranked' : '⭐ Elite Mentor'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
