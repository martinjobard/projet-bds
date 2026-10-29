const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('bds_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMsg = 'Une erreur est survenue';
    if (typeof data.detail === 'string') {
      errorMsg = data.detail;
    } else if (Array.isArray(data.detail)) {
      errorMsg = data.detail.map(d => d.msg || JSON.stringify(d)).join(', ');
    } else if (data.detail && typeof data.detail === 'object') {
      errorMsg = JSON.stringify(data.detail);
    }
    throw new Error(errorMsg);
  }

  return data;
}

function toQueryString(params = {}) {
  const clean = {};
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '' && val !== 'Tous' && val !== 'ALL') {
      clean[key] = val;
    }
  }
  const qs = new URLSearchParams(clean).toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  // Auth
  auth: {
    login: (password) => request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
    verify: () => request('/auth/verify'),
  },

  // Equipment & Loans
  equipment: {
    list: (params = {}) => request(`/equipment${toQueryString(params)}`),
    get: (id) => request(`/equipment/${id}`),
    create: (data) => request('/equipment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => request(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => request(`/equipment/${id}`, {
      method: 'DELETE',
    }),
    requestLoan: (data) => request('/equipment/loans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getMyLoans: (email) => request(`/equipment/loans/my?email=${encodeURIComponent(email)}`),
    adminListLoans: (status = 'ALL') => request(`/equipment/admin/loans?status_filter=${status}`),
    adminUpdateLoanStatus: (id, data) => request(`/equipment/admin/loans/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },

  // Tournaments & Results
  tournaments: {
    list: () => request('/tournaments'),
    get: (id) => request(`/tournaments/${id}`),
    create: (data) => request('/tournaments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => request(`/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => request(`/tournaments/${id}`, {
      method: 'DELETE',
    }),
    addResult: (tournamentId, data) => request(`/tournaments/${tournamentId}/results`, {
      method: 'POST',
      body: JSON.stringify({ ...data, tournament_id: tournamentId }),
    }),
    deleteResult: (resultId) => request(`/tournaments/results/${resultId}`, {
      method: 'DELETE',
    }),
  },

  // Nancy Events
  events: {
    list: (params = {}) => request(`/events${toQueryString(params)}`),
    get: (id) => request(`/events/${id}`),
    create: (data) => request('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => request(`/events/${id}`, {
      method: 'DELETE',
    }),
  },

  // University Matches, Teams & FFSU
  matches: {
    list: (params = {}) => request(`/matches${toQueryString(params)}`),
    get: (id) => request(`/matches/${id}`),
    create: (data) => request('/matches', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => request(`/matches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => request(`/matches/${id}`, {
      method: 'DELETE',
    }),
    // Teams
    listTeams: (params = {}) => request(`/matches/teams${toQueryString(params)}`),
    getTeam: (id) => request(`/matches/teams/${id}`),
    createTeam: (data) => request('/matches/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    updateTeam: (id, data) => request(`/matches/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    deleteTeam: (id) => request(`/matches/teams/${id}`, {
      method: 'DELETE',
    }),
  },

  // Stats
  stats: {
    getDashboard: () => request('/stats/dashboard'),
  },
};
