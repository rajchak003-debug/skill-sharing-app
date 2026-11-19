import API from './api';

export const updateProfile = async (profileData) => {
  const response = await API.put('/auth/profile', profileData);
  if (response.data.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};