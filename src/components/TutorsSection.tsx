import React, { useState, useEffect } from 'react';
import { api, TutorDetail, Subject } from '../services/api';
import { TutorCard } from './TutorCard';
import { Search, Filter, BookOpen } from 'lucide-react';

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
      // Error
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
      // Error
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tutorsSection" className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Explore Our Tutors
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Find verified educators matching your subject requirements and learning style.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, subject, bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>

        {/* Subjects Filter Bar */}
        <div id="subjectsSection" className="mb-10">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Subject</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubject(null)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedSubject === null
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-slate-200/60 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : tutors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <TutorCard
                key={tutor.user_id}
                tutor={tutor}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No tutors found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or choosing a different subject category.
            </p>
            <button
              onClick={() => {
                setSelectedSubject(null);
                setSearchTerm('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
