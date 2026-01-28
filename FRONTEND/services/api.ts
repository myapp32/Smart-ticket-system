import { Ticket, User } from '../types';

/**
 * IMPORTANT:
 * This must come from Vite env and NOT be undefined.
 * In Docker it should be: http://backend:5000
 */
const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ===================== TYPES ===================== */

interface LoginData {
  email: string;
  password: string;
}

interface SignupData extends LoginData {
  name: string;
}

interface UpdateUserData {
  userId: string;
  role?: string;
  skills?: string[];
}

interface CreateTicketData {
  title: string;
  description: string;
}

/* ===================== TOKEN ===================== */

const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/* ===================== FETCH WITH AUTH ===================== */

const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  if (!API_BASE_URL) {
    throw new Error(
      'VITE_API_URL is not defined. Check FRONTEND/.env and rebuild the app.'
    );
  }

  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorMessage;
    } catch {}

    // Handle auth failure
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.hash = '/login';
    }

    throw new Error(errorMessage);
  }

  return response;
};

/* ===================== API ===================== */

export const api = {
  /* ---------- AUTH ---------- */

  login: async (
    credentials: LoginData
  ): Promise<{ token: string; user: User }> => {
    const response = await fetchWithAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  },

  signup: async (
    userData: SignupData
  ): Promise<{ token: string; user: User }> => {
    const response = await fetchWithAuth('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  },

  getProfile: async (): Promise<User> => {
    const response = await fetchWithAuth('/api/auth/profile');
    return response.json();
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await fetchWithAuth('/api/auth/users');
    return response.json();
  },

  updateUser: async (data: UpdateUserData): Promise<User> => {
    const response = await fetchWithAuth('/api/auth/update-user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /* ---------- TICKETS ---------- */

  getTickets: async (): Promise<Ticket[]> => {
    const response = await fetchWithAuth('/api/tickets');
    return response.json();
  },

  getTicketById: async (id: string): Promise<Ticket> => {
    const response = await fetchWithAuth(`/api/tickets/${id}`);
    const data = await response.json();
    return data.ticket;
  },

  createTicket: async (data: CreateTicketData): Promise<Ticket> => {
    const response = await fetchWithAuth('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const resData = await response.json();
    return resData.ticket;
  },

  updateTicket: async (
    id: string,
    data: { title: string; description: string }
  ): Promise<Ticket> => {
    const response = await fetchWithAuth(`/api/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    const resData = await response.json();
    return resData.ticket;
  },

  updateTicketStatus: async (
    id: string,
    data: { status: string }
  ): Promise<Ticket> => {
    const response = await fetchWithAuth(`/api/tickets/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    const resData = await response.json();
    return resData.ticket;
  },
};

