import API from './api';

export const createBooking = async (bookingData) => {
  const response = await API.post('/bookings', bookingData);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await API.get('/bookings');
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await API.patch(`/bookings/${id}/status`, { status });
  return response.data;
};