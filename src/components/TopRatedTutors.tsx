import React, { useEffect, useState } from 'react';
import { api, TutorDetail } from '../services/api';
import { TutorCard } from './TutorCard';
import { Award, Sparkles } from 'lucide-react';

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
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  if (!loading && tutors.length === 0) return null;

  return (
    <section id="topRatedSection" className="py-16 bg-gradient-to-b from-indigo-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Highest Rated</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Top Rated Tutors
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Meet our most celebrated tutors who consistently deliver exceptional learning outcomes.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tutors.map((tutor, idx) => (
              <TutorCard
                key={tutor.user_id}
                tutor={tutor}
                onViewProfile={onViewProfile}
                badge={`#${idx + 1} Top Rated`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
