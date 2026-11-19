import React, { useState, useEffect } from 'react';
import { getUserBookings, updateBookingStatus } from '../../services/bookingService';
import BookingCard from './BookingCard';
import { useAuth } from '../../hooks/useAuth';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getUserBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading bookings...</div>;

  const learningBookings = bookings.filter((b) => b.learner?._id === user?._id);
  const teachingBookings = bookings.filter((b) => b.provider?._id === user?._id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings & Sessions</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sessions I'm Learning</h2>
        {learningBookings.length === 0 ? (
          <p className="text-gray-500 bg-white p-6 rounded-xl border border-gray-200">No booking requests made yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} currentUserId={user?._id} onStatusUpdate={handleStatusUpdate} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Teaching Requests (My Skills)</h2>
        {teachingBookings.length === 0 ? (
          <p className="text-gray-500 bg-white p-6 rounded-xl border border-gray-200">No incoming teaching requests yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teachingBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} currentUserId={user?._id} onStatusUpdate={handleStatusUpdate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;