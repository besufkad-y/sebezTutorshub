import React, { useState, useEffect } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-base">Edit Tutor Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-indigo-200 shrink-0">
              <img
                src={previewUrl || '/images/users/1.jpg'}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Profile Image
              </label>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-xs font-semibold text-slate-700 shadow-sm transition">
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Upload New Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400 mt-1">
                JPG, PNG, WebP up to 5MB.
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City / Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tutor Credentials & Rates */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Teaching Details
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Teaching Philosophy</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell students and parents about your approach, background, and strengths..."
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Education & Certifications</label>
              <textarea
                rows={2}
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Degrees, certifications, universities attended..."
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="e.g. 50.00"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Availability Schedule</label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g. Mon, Wed, Fri (Afternoons)"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Subjects (limit 7) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Subjects You Teach
              </h4>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  selectedSubjectIds.length >= 7
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                Selected: {selectedSubjectIds.length} / 7
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-100">
              {allSubjects.map((sub) => {
                const subId = sub.id || sub.subject_id!;
                const isChecked = selectedSubjectIds.includes(subId);
                const disabled = !isChecked && selectedSubjectIds.length >= 7;

                return (
                  <label
                    key={subId}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium cursor-pointer transition ${
                      isChecked
                        ? 'bg-indigo-600 text-white font-semibold'
                        : disabled
                        ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={disabled}
                      checked={isChecked}
                      onChange={() => handleSubjectToggle(subId)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="truncate">{sub.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
