import axios from "axios";

const API_BASE = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh && !error.config._retry) {
        error.config._retry = true;
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh-token`, { refresh_token: refresh });
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          error.config.headers.Authorization = `Bearer ${data.access_token}`;
          return api(error.config);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
};

export const postsAPI = {
  create: (data) => api.post("/posts/", data),
  list: (params) => api.get("/posts/", { params }),
  get: (id) => api.get(`/posts/${id}`),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  publish: (id) => api.post(`/posts/${id}/publish`),
  schedule: (id, data) => api.post(`/posts/${id}/schedule`, data),
  sendForApproval: (id) => api.post(`/posts/${id}/send-approval`),
};

export const draftsAPI = {
  save: (data) => api.post("/drafts/", data),
  list: () => api.get("/drafts/"),
  update: (id, data) => api.put(`/drafts/${id}`, data),
  delete: (id) => api.delete(`/drafts/${id}`),
  duplicate: (id) => api.post(`/drafts/${id}/duplicate`),
  convert: (id) => api.post(`/drafts/${id}/convert`),
};

export const approvalsAPI = {
  list: (params) => api.get("/approvals/", { params }),
  approve: (id, data) => api.post(`/approvals/${id}/approve`, data || {}),
  reject: (id, data) => api.post(`/approvals/${id}/reject`, data),
};

export const analyticsAPI = {
  overview: () => api.get("/analytics/overview"),
  engagement: () => api.get("/analytics/engagement"),
  monthlyGrowth: () => api.get("/analytics/monthly-growth"),
  platformPerformance: () => api.get("/analytics/platform-performance"),
};

export const accountsAPI = {
  list: () => api.get("/accounts/"),
  connect: (platform) => api.post(`/accounts/connect/${platform}`),
  disconnect: (id) => api.delete(`/accounts/${id}`),
};

export const aiAPI = {
  generateCaption: (data) => api.post("/ai/generate-caption", data),
  rewriteContent: (data) => api.post("/ai/rewrite-content", data),
  generateHashtags: (data) => api.post("/ai/generate-hashtags", data),
  generateImage: (data) => api.post("/ai/generate-image", data),
};

export const notificationsAPI = {
  list: () => api.get("/notifications/"),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/read-all"),
};

export const settingsAPI = {
  getProfile: () => api.get("/settings/profile"),
  updateProfile: (data) => api.put("/settings/profile", data),
  changePassword: (data) => api.put("/settings/password", data),
  getBrand: () => api.get("/settings/brand"),
  updateBrand: (data) => api.put("/settings/brand", data),
};

export default api;
