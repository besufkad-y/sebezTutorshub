import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react';

const SLIDES = [
  {
    image: '/images/sliders/1.jpg',
    fallback: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80',
    tag: 'WORLD-CLASS FACULTY',
    title: 'Precision Tutoring For Ambitious Minds',
    description: 'Direct 1-on-1 mentorship with vetted educators from MIT, Stanford, and Oxford across 13+ specialized academic domains.',
    buttonText: 'Explore Verified Tutors',
    link: '#tutorsSection',
    accentColor: 'from-violet-500 to-fuchsia-500',
  },
  {
    image: '/images/sliders/2.jpg',
    fallback: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80',
    tag: 'ADAPTIVE CURRICULUM',
    title: 'Customized Mastery, Not Mass Production',
    description: 'Every session is reverse-engineered around your cognitive pace, exam dates, and long-term academic ambitions.',
    buttonText: 'Find Your Match',
    link: '#tutorsSection',
    accentColor: 'from-cyan-400 to-blue-500',
  },
  {
    image: '/images/sliders/3.jpg',
    fallback: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    tag: 'PROVEN OUTCOMES',
    title: 'Transform Potential Into Top Percentiles',
    description: 'Over 98% of students achieve an improvement of at least one letter grade or 200+ SAT points within 6 weeks.',
    buttonText: 'View Top Rated Tutors',
    link: '#topRatedSection',
    accentColor: 'from-amber-400 to-rose-500',
  },
];

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[660px] overflow-hidden bg-[#07080D]">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        {SLIDES.map((slide, index) => {
          if (index !== currentSlide) return null;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <img
                src={slide.image}
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = slide.fallback;
                }}
                alt={slide.title}
                className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-125"
              />
              {/* Layered cinematic overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080D] via-[#07080D]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#07080D] via-[#07080D]/80 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.18),transparent_60%)]" />

              {/* Text content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-3xl space-y-6">
                    {/* Tag badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                      <span className="text-[11px] font-mono-accent font-bold uppercase tracking-widest text-violet-300">
                        {slide.tag}
                      </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.6 }}
                      className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]"
                    >
                      {slide.title}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl"
                    >
                      {slide.description}
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.65, duration: 0.6 }}
                      className="pt-2 flex flex-wrap gap-4 items-center"
                    >
                      <a
                        href={slide.link}
                        className="relative group px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-white overflow-hidden shadow-2xl transition transform hover:-translate-y-0.5"
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor} transition-transform duration-500 group-hover:scale-105`}
                        />
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center gap-2">
                          <span>{slide.buttonText}</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </a>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3">
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="p-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] text-white border border-white/[0.1] backdrop-blur-md transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="p-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] text-white border border-white/[0.1] backdrop-blur-md transition cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Line Indicators */}
      <div className="absolute bottom-8 left-8 z-30 flex items-center gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="group py-2 focus:outline-none"
          >
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? 'w-12 bg-gradient-to-r from-violet-500 to-cyan-400'
                  : 'w-4 bg-white/20 group-hover:bg-white/40'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
