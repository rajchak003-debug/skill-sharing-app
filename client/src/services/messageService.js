import API from './api';

export const getBookingMessages = async (bookingId) => {
  const response = await API.get(`/messages/${bookingId}`);
  return response.data;
};

export const sendMessage = async (bookingId, text) => {
  const response = await API.post(`/messages/${bookingId}`, { text });
  return response.data;
};