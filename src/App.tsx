import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { Hero } from './components/Hero';
import { TopRatedTutors } from './components/TopRatedTutors';
import { TutorsSection } from './components/TutorsSection';
import { Footer } from './components/Footer';
import { TutorProfileModal } from './components/modals/TutorProfileModal';
import { BookSessionModal } from './components/modals/BookSessionModal';
import { SessionsModal } from './components/modals/SessionsModal';
import { MessagesModal } from './components/modals/MessagesModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { AuthModal } from './components/modals/AuthModal';
import { HowItWorksModal } from './components/modals/HowItWorksModal';
import { PricingModal } from './components/modals/PricingModal';
import { WebsiteReviewModal } from './components/modals/WebsiteReviewModal';
import { ContactModal } from './components/modals/ContactModal';
import { Toast, ToastMessage } from './components/Toast';
import { TutorDetail } from './services/api';

function MainApp() {
  const { isAuthenticated } = useAuth();

  // Modals state
  const [selectedTutor, setSelectedTutor] = useState<TutorDetail | null>(null);
  const [bookingTutor, setBookingTutor] = useState<TutorDetail | null>(null);
  const [messagingPartner, setMessagingPartner] = useState<TutorDetail | null>(null);

  const [authModal, setAuthModal] = useState<{ mode: 'login' | 'register'; role?: 'student' | 'tutor' | 'parent' } | null>(null);
  const [isSessionsOpen, setIsSessionsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isWebsiteReviewOpen, setIsWebsiteReviewOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStartBooking = (tutor: TutorDetail) => {
    if (!isAuthenticated) {
      showToast('Please login or register to book a tutoring session.', 'warning');
      setAuthModal({ mode: 'login' });
      return;
    }
    setSelectedTutor(null);
    setBookingTutor(tutor);
  };

  const handleStartMessaging = (tutor: TutorDetail) => {
    if (!isAuthenticated) {
      showToast('Please login or register to message tutors.', 'warning');
      setAuthModal({ mode: 'login' });
      return;
    }
    setSelectedTutor(null);
    setMessagingPartner(tutor);
    setIsMessagesOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification Layer */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Main Navbar */}
      <Navbar
        onOpenLogin={() => setAuthModal({ mode: 'login' })}
        onOpenRegister={() => setAuthModal({ mode: 'register' })}
        onOpenMessages={() => {
          setMessagingPartner(null);
          setIsMessagesOpen(true);
        }}
        onOpenSessions={() => setIsSessionsOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
      />

      {/* Swiper Hero Slider Section */}
      <HeroSlider />

      {/* Hero Overview & Value Props */}
      <Hero onOpenRegisterTutor={() => setAuthModal({ mode: 'register', role: 'tutor' })} />

      {/* Top Rated Tutors Section */}
      <TopRatedTutors onViewProfile={(tutor) => setSelectedTutor(tutor)} />

      {/* All Tutors Grid & Subject Filtering */}
      <TutorsSection
        refreshTrigger={refreshTrigger}
        onViewProfile={(tutor) => setSelectedTutor(tutor)}
      />

      {/* Footer */}
      <Footer
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenWebsiteReview={() => setIsWebsiteReviewOpen(true)}
      />

      {/* Modals & Overlays */}
      {selectedTutor && (
        <TutorProfileModal
          tutor={selectedTutor}
          onClose={() => setSelectedTutor(null)}
          onBookSession={handleStartBooking}
          onSendMessage={handleStartMessaging}
          onOpenSessions={() => {
            setSelectedTutor(null);
            setIsSessionsOpen(true);
          }}
          showToast={showToast}
        />
      )}

      {bookingTutor && (
        <BookSessionModal
          tutor={bookingTutor}
          onClose={() => setBookingTutor(null)}
          onSuccess={() => {
            setRefreshTrigger((prev) => prev + 1);
          }}
          showToast={showToast}
        />
      )}

      {isSessionsOpen && (
        <SessionsModal
          onClose={() => setIsSessionsOpen(false)}
          showToast={showToast}
        />
      )}

      {isMessagesOpen && (
        <MessagesModal
          initialPartner={messagingPartner}
          onClose={() => {
            setIsMessagesOpen(false);
            setMessagingPartner(null);
          }}
          showToast={showToast}
        />
      )}

      {isEditProfileOpen && (
        <EditProfileModal
          onClose={() => setIsEditProfileOpen(false)}
          onSuccess={() => {
            setRefreshTrigger((prev) => prev + 1);
          }}
          showToast={showToast}
        />
      )}

      {authModal && (
        <AuthModal
          initialMode={authModal.mode}
          initialRole={authModal.role}
          onClose={() => setAuthModal(null)}
          showToast={showToast}
        />
      )}

      {isHowItWorksOpen && (
        <HowItWorksModal
          onClose={() => setIsHowItWorksOpen(false)}
          onExplore={() => {
            const el = document.getElementById('tutorsSection');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {isPricingOpen && (
        <PricingModal
          onClose={() => setIsPricingOpen(false)}
          onExplore={() => {
            const el = document.getElementById('tutorsSection');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {isWebsiteReviewOpen && (
        <WebsiteReviewModal
          onClose={() => setIsWebsiteReviewOpen(false)}
          showToast={showToast}
        />
      )}

      {isContactOpen && (
        <ContactModal
          onClose={() => setIsContactOpen(false)}
          showToast={showToast}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
