import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api, TutorDetail, Subject } from '../services/api';
import { TutorCard } from './TutorCard';
import { Search, Filter, BookOpen, Sparkles, X, SlidersHorizontal } from 'lucide-react';

interface TutorsSectionProps {
  onViewProfile: (tutor: TutorDetail) => void;
  refreshTrigger?: number;
}

export const TutorsSection: React.FC<TutorsSectionProps> = ({ onViewProfile, refreshTrigger }) => {
  const [tutors, setTutors] = useState<TutorDetail[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    loadTutors();
  }, [selectedSubject, searchTerm, refreshTrigger]);

  const loadSubjects = async () => {
    try {
      const data = await api.getSubjects();
      setSubjects(data);
    } catch {
      // Handled silently
    }
  };

  const loadTutors = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedSubject) params.subject = selectedSubject;
      if (searchTerm.trim()) params.search = searchTerm.trim();
      const data = await api.getTutors(params);
      setTutors(data);
    } catch {
      // Handled silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tutorsSection" className="relative py-20 lg:py-28 bg-[#07080D]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-cyan-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[11px] font-mono-accent uppercase tracking-widest font-bold">
                EXPLORE TUTOR DIRECTORY
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Find Your Subject Expert
            </h2>
            <p className="text-sm text-slate-400 max-w-xl font-light">
              Filter by specialized disciplines, examine credentials, and book direct private sessions.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-88">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by tutor, specialty, bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-white/[0.04] border border-white/[0.12] focus:border-violet-500 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition shadow-inner backdrop-blur-md"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Subjects Filter Bar */}
        <div id="subjectsSection" className="mb-12 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-accent uppercase tracking-wider text-slate-400">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-violet-400" />
              <span>ACADEMIC DISCIPLINES ({subjects.length})</span>
            </div>
            <span className="text-violet-400 font-bold">
              Showing {tutors.length} available tutor{tutors.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Interactive filter segmented buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => setSelectedSubject(null)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono-accent font-bold uppercase tracking-wider transition cursor-pointer ${
                selectedSubject === null
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30 border border-violet-400/40'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
              }`}
            >
              All Subjects
            </button>
            {subjects.map((sub) => {
              const subId = sub.id || sub.subject_id;
              const isSelected = selectedSubject === subId;
              return (
                <button
                  key={subId}
                  onClick={() => setSelectedSubject(subId)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono-accent font-bold uppercase tracking-wider transition cursor-pointer ${
                    isSelected
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30 border border-violet-400/40'
                      : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tutors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-white/[0.02] border border-white/[0.06] animate-pulse"
              />
            ))}
          </div>
        ) : tutors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutors.map((tutor) => (
              <TutorCard
                key={tutor.user_id}
                tutor={tutor}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-white/[0.02] border border-white/[0.08] p-8 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-xl font-bold text-white">No Tutors Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find any educators matching your specific criteria. Try searching with another keyword or resetting filters.
            </p>
            <button
              onClick={() => {
                setSelectedSubject(null);
                setSearchTerm('');
              }}
              className="mt-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-violet-300 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 rounded-xl transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
