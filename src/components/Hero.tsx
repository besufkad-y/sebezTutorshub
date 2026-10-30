import React from 'react';
import { Users, Globe, Star, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenRegisterTutor: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRegisterTutor }) => {
  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Find the Perfect <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Tutor</span> for Your Learning Journey
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Connect with expert tutors in any subject, anytime, anywhere. Personalized learning experiences tailored to your unique pace, goals, and academic needs.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#tutorsSection"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition transform hover:-translate-y-0.5"
              >
                <span>Find a Tutor</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={onOpenRegisterTutor}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-300 transition"
              >
                Become a Tutor
              </button>
            </div>

            {/* Value Props Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">1000+ Tutors</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Top vetted experts</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Flexible Formats</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Online & In-person</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">4.9/5 Rating</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Verified reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-indigo-100 via-indigo-50 to-transparent -rotate-2 -z-10" />
              <img
                src="https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80"
                alt="Tutoring Session"
                className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3] border-4 border-white"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 hidden sm:flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                  98%
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Student Success Rate</div>
                  <div className="text-xs text-slate-500">Based on verified outcomes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
