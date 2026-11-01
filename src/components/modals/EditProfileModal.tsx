import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { api, Subject } from '../../services/api';
import { validateSubjectLimit } from '../../utils/validation';
import { X, Save, Upload, User, BookOpen } from 'lucide-react';

interface EditProfileModalProps {
  onClose: () => void;
  onSuccess: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  onClose,
  onSuccess,
  showToast,
}) => {
  const { user, updateUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [address, setAddress] = useState(user?.address || '');

  const [bio, setBio] = useState('');
  const [education, setEducation] = useState('');
  const [hourlyRate, setHourlyRate] = useState<string | number>('');
  const [availability, setAvailability] = useState('');

  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(user?.profile_picture_url || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;
    try {
      const [subjectsData, tutorData] = await Promise.all([
        api.getSubjects(),
        api.getTutor(user.user_id),
      ]);
      setAllSubjects(subjectsData);
      if (tutorData) {
        setBio(tutorData.bio || '');
        setEducation(tutorData.education || '');
        setHourlyRate(tutorData.hourly_rate || '');
        setAvailability(tutorData.availability || '');
        setSelectedSubjectIds(tutorData.subject_ids || []);
      }
    } catch {
      showToast('Error loading profile data.', 'error');
    }
  };

  const handleSubjectToggle = (subjectId: number) => {
    if (selectedSubjectIds.includes(subjectId)) {
      setSelectedSubjectIds(selectedSubjectIds.filter((id) => id !== subjectId));
    } else {
      if (selectedSubjectIds.length >= 7) {
        showToast('You can select a maximum of 7 subjects.', 'warning');
        return;
      }
      setSelectedSubjectIds([...selectedSubjectIds, subjectId]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSubjectLimit(selectedSubjectIds)) {
      showToast('Maximum limit of 7 subjects exceeded.', 'error');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('first_name', firstName.trim());
      formData.append('last_name', lastName.trim());
      formData.append('phone_number', phoneNumber.trim());
      formData.append('address', address.trim());
      formData.append('bio', bio.trim());
      formData.append('education', education.trim());
      formData.append('hourly_rate', String(hourlyRate));
      formData.append('availability', availability.trim());
      formData.append('subjects', JSON.stringify(selectedSubjectIds));

      if (profileImage) {
        formData.append('profile_image', profileImage);
      }

      const res = await api.updateTutorProfile(formData);
      if (res.success) {
        showToast('Profile updated successfully!', 'success');
        if (res.user) {
          updateUser(res.user);
        }
        onSuccess();
        onClose();
      } else {
        showToast(res.message || 'Failed to update profile.', 'error');
      }
    } catch {
      showToast('Error updating profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-3xl bg-[#0C0E18] rounded-3xl border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0F121E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Edit Tutor Profile</h3>
              <p className="text-[11px] font-mono-accent text-slate-400">CREDENTIALS & SPECIALIZATIONS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#161B2E] border border-violet-500/40 shrink-0">
              <img
                src={previewUrl || '/images/users/1.jpg'}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-accent uppercase tracking-wider text-slate-300 font-bold mb-1">
                Profile Avatar Photo
              </label>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 rounded-xl text-xs font-bold uppercase tracking-wider text-violet-300 transition">
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports JPG, PNG, WebP up to 5MB.
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono-accent uppercase tracking-widest text-violet-400 font-bold">
              PERSONAL IDENTITY
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
            </div>
          </div>

          {/* Teaching Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono-accent uppercase tracking-widest text-violet-400 font-bold">
              INSTRUCTIONAL PROFILE
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Teaching Methodology</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your subject mastery, teaching philosophy, and student successes..."
                className="w-full px-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Degrees & Certifications</label>
              <textarea
                rows={2}
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Institutions, degrees, or certifications obtained..."
                className="w-full px-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="e.g. 65.00"
                  className="w-full px-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Availability Schedule</label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g. Mon, Wed, Fri (Afternoons)"
                  className="w-full px-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
            </div>
          </div>

          {/* Subjects (7 max) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono-accent uppercase tracking-widest text-violet-400 font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>SUBJECTS YOU INSTRUCT (MAX 7)</span>
              </h4>
              <span
                className={`text-[11px] font-mono-accent font-bold px-2.5 py-0.5 rounded-lg border ${
                  selectedSubjectIds.length >= 7
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {selectedSubjectIds.length} / 7 SELECTED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              {allSubjects.map((sub) => {
                const subId = sub.id || sub.subject_id!;
                const isChecked = selectedSubjectIds.includes(subId);
                const disabled = !isChecked && selectedSubjectIds.length >= 7;

                return (
                  <label
                    key={subId}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium cursor-pointer transition ${
                      isChecked
                        ? 'bg-violet-600 text-white font-bold border border-violet-400/40 shadow-sm'
                        : disabled
                        ? 'opacity-30 cursor-not-allowed bg-white/[0.01] text-slate-500'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={disabled}
                      checked={isChecked}
                      onChange={() => handleSubjectToggle(subId)}
                      className="rounded text-violet-600 focus:ring-violet-500"
                    />
                    <span className="truncate">{sub.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-white/[0.08] flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-4 rounded-2xl border border-white/[0.1] text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-white/[0.05] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
