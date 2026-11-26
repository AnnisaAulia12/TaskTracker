
import { Capacitor } from '@capacitor/core';

const API_BASE_URL = Capacitor.isNativePlatform()
  ? 'http://10.0.2.2:8000'
  : import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
// Register User
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(data.detail)
        ? data.detail.map((error) => error.msg).join(', ')
        : data.detail || 'Registration failed';

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Login User
export async function loginUser(email, password) {
  const formData = new URLSearchParams();

  formData.append('username', email);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || 'Invalid email or password'
    );
  }

  return data;
}

// Get Current Logged-in User
export async function getCurrentUser() {
  const token = sessionStorage.getItem('access_token');

  if (!token) {
    throw new Error('Authentication token not found.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || 'Failed to get user information.'
    );
  }

  return data;
}

// Delete Account
export async function deleteAccount() {
  const token = sessionStorage.getItem('access_token');

  if (!token) {
    const error = new Error('Please login first.');
    error.status = 401;
    throw error;
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    const error = new Error(
      data?.detail || 'Failed to delete account.'
    );

    error.status = response.status;
    throw error;
  }

  return true;
}
