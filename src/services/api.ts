// src/services/api.ts

const API_BASE = '/api';

export interface User {
  user_id: number;
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'tutor' | 'student' | 'parent';
  profile_picture_url?: string;
  phone_number?: string;
  address?: string;
  created_at?: string;
}

export interface TutorDetail extends User {
  bio?: string;
  education?: string;
  hourly_rate?: string | number;
  availability?: string;
  average_rating: number;
  total_reviews: number;
  subjects: string[];
  subject_ids: number[];
}

export interface Subject {
  id: number;
  subject_id?: number;
  name: string;
}

export interface TutoringSession {
  id: number;
  session_id: number;
  tutor_id: number;
  student_id: number;
  tutor_name: string;
  student_name: string;
  session_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface Message {
  id: number;
  message_id: number;
  sender_id: number;
  receiver_id: number;
  sender_name: string;
  receiver_name: string;
  message_content: string;
  created_at: string;
}

export interface Conversation {
  user_id: number;
  name: string;
  avatar: string;
  role: string;
  last_message: string;
  last_time: string;
}

export interface TutorReview {
  id: number;
  tutor_id: number;
  student_id: number;
  student_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async register(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
  }) {
    const res = await fetch(`${API_BASE}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me/`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    const res = await fetch(`${API_BASE}/subjects/`);
    if (!res.ok) return [];
    return res.json();
  },

  // Tutors
  async getTutors(params?: { top_rated?: boolean | number; subject?: number; search?: string }): Promise<TutorDetail[]> {
    const query = new URLSearchParams();
    if (params?.top_rated) query.set('top_rated', '1');
    if (params?.subject) query.set('subject', String(params.subject));
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/tutors/?${query.toString()}`);
    if (!res.ok) return [];
    return res.json();
  },

  async getTutor(id: number): Promise<TutorDetail | null> {
    const res = await fetch(`${API_BASE}/tutors/${id}/`);
    if (!res.ok) return null;
    return res.json();
  },

  async getTutorSubjectIds(id: number): Promise<number[]> {
    const res = await fetch(`${API_BASE}/tutors/${id}/subjects/`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.subjects || [];
  },

  async updateTutorProfile(formData: FormData) {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Token ${token}`;

    const res = await fetch(`${API_BASE}/tutors/update-profile/`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return res.json();
  },

  // Sessions
  async getSessions(): Promise<{ success: boolean; sessions: TutoringSession[] }> {
    const res = await fetch(`${API_BASE}/sessions/`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async createSession(data: { tutor_id: number; session_date: string; notes?: string }) {
    const res = await fetch(`${API_BASE}/sessions/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateSessionStatus(sessionId: number, status: 'completed' | 'cancelled') {
    const res = await fetch(`${API_BASE}/sessions/update-status/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ session_id: sessionId, status }),
    });
    return res.json();
  },

  // Messaging
  async getConversations(): Promise<{ success: boolean; conversations: Conversation[] }> {
    const res = await fetch(`${API_BASE}/messages/conversations/`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getMessages(partnerId: number): Promise<{ success: boolean; messages: Message[] }> {
    const res = await fetch(`${API_BASE}/messages/${partnerId}/`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async sendMessage(receiverId: number, messageContent: string) {
    const res = await fetch(`${API_BASE}/messages/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ receiver_id: receiverId, message_content: messageContent }),
    });
    return res.json();
  },

  // Reviews
  async getTutorReviews(tutorId: number): Promise<{ success: boolean; reviews: TutorReview[] }> {
    const res = await fetch(`${API_BASE}/reviews/tutor/${tutorId}/`);
    return res.json();
  },

  async submitTutorReview(data: { tutor_id: number; rating: number; comment: string }) {
    const res = await fetch(`${API_BASE}/reviews/tutor/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async submitWebsiteReview(data: { rating: number; review_text: string }) {
    const res = await fetch(`${API_BASE}/reviews/website/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Contact
  async submitContact(data: { name: string; email: string; subject: string; message: string }) {
    const res = await fetch(`${API_BASE}/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
