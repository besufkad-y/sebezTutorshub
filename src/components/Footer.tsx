import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, Star, Heart } from 'lucide-react';

interface FooterProps {
  onOpenHowItWorks: () => void;
  onOpenPricing: () => void;
  onOpenContact: () => void;
  onOpenWebsiteReview: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenHowItWorks,
  onOpenPricing,
  onOpenContact,
  onOpenWebsiteReview,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-2xl font-extrabold text-white">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span>EduConnect</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Connecting students and parents with vetted, expert educators for highly personalized learning experiences.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenWebsiteReview}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-400 border border-slate-700 transition"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Rate Platform</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-indigo-400 transition">Home</a>
              </li>
              <li>
                <a href="#tutorsSection" className="hover:text-indigo-400 transition">Find Tutors</a>
              </li>
              <li>
                <a href="#subjectsSection" className="hover:text-indigo-400 transition">Subjects</a>
              </li>
              <li>
                <button onClick={onOpenHowItWorks} className="hover:text-indigo-400 transition cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={onOpenPricing} className="hover:text-indigo-400 transition cursor-pointer">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-indigo-400 transition cursor-pointer">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Subjects */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Subjects
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#tutorsSection" className="hover:text-white transition">Mathematics & Calculus</a>
              </li>
              <li>
                <a href="#tutorsSection" className="hover:text-white transition">Physics & Chemistry</a>
              </li>
              <li>
                <a href="#tutorsSection" className="hover:text-white transition">Computer Science & AI</a>
              </li>
              <li>
                <a href="#tutorsSection" className="hover:text-white transition">Languages (Spanish, French)</a>
              </li>
              <li>
                <a href="#tutorsSection" className="hover:text-white transition">Test Preparation (SAT/ACT)</a>
              </li>
              <li>
                <a href="#tutorsSection" className="hover:text-white transition">Economics & Business</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Us */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>123 Education St, Learning City, 54321</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@educonnect.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; 2026 EduConnect Tutoring Platform. Rebuilt with DRF, React, and TDD.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision & high standards</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
