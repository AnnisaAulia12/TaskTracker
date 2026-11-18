
import { Capacitor } from '@capacitor/core';

const API_BASE_URL = Capacitor.isNativePlatform()
  ? 'http://10.0.2.2:8000'
  : 'http://127.0.0.1:8000';

// Helper untuk mengirim request dengan JWT
async function taskRequest(endpoint, options = {}) {
  const token = sessionStorage.getItem('access_token');

  if (!token) {
    const error = new Error('Please login first.');
    error.status = 401;
    throw error;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // DELETE biasanya mengembalikan 204 tanpa response body
  const data = response.status === 204
    ? null
    : await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(data?.detail)
      ? data.detail.map((item) => item.msg).join(', ')
      : data?.detail || 'Something went wrong.';

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

// GET: Mengambil semua task milik user
export async function getTasks() {
  return taskRequest('/tasks', {
    method: 'GET',
  });
}

// POST: Membuat task baru
export async function createTask(taskData) {
  return taskRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

// PUT: Mengubah task
export async function updateTask(taskId, taskData) {
  return taskRequest(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });
}

// DELETE: Menghapus task
export async function deleteTask(taskId) {
  return taskRequest(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
}
