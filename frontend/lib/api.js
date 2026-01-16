const API_BASE_URL = "http://localhost:8000";

export async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add token if it exists
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "API request failed");
  }

  return response.json();
}

export async function signup(email, username, password) {
  return apiCall("/signup", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
  });
}

export async function login(email, password) {
  return apiCall("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getUser(userId) {
  return apiCall(`/user/${userId}`);
}
