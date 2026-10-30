import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    image: '/images/sliders/1.jpg',
    fallback: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80',
    title: 'Expert Tutors for Every Subject',
    description: 'Connect with top educators from around the world specialized in your field of study.',
    buttonText: 'Find Your Tutor',
    link: '#tutorsSection',
  },
  {
    image: '/images/sliders/2.jpg',
    fallback: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80',
    title: 'Personalized Learning Experience',
    description: 'Customized lessons tailored to your learning style, pace, and academic goals.',
    buttonText: 'Start Learning',
    link: '#tutorsSection',
  },
  {
    image: '/images/sliders/3.jpg',
    fallback: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    title: 'Achieve Your Academic Goals',
    description: 'Proven methods to help you excel in exams, assignments, and career development.',
    buttonText: 'View Success Stories',
    link: '#topRatedSection',
  },
];

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] overflow-hidden bg-slate-900">
      {SLIDES.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Dark Gradient Overlay */}
            <img
              src={slide.image}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = slide.fallback;
              }}
              alt={slide.title}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent" />

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl text-white space-y-4">
                  <span className="inline-block py-1 px-3 bg-indigo-600/80 backdrop-blur text-xs font-bold uppercase tracking-wider rounded-full">
                    Top Rated Education
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
                    {slide.title}
                  </h2>
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-light">
                    {slide.description}
                  </p>
                  <div className="pt-2">
                    <a
                      href={slide.link}
                      className="inline-flex items-center justify-center px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
                    >
                      {slide.buttonText}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-indigo-500' : 'w-2.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
