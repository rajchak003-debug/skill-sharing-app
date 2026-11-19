import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createBooking } from '../../services/bookingService';

const BookingModal = ({ skill, onClose, onSuccess }) => {
  const [sessionDate, setSessionDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createBooking({
        skillId: skill._id,
        sessionDate,
        durationMinutes: Number(durationMinutes),
        message,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Book Session</h2>
        <p className="text-sm text-gray-600 mb-4">Request a learning session for <span className="font-semibold">{skill.title}</span> with {skill.owner?.name}</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Date & Time</label>
            <input
              type="datetime-local"
              required
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Minutes)</label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="30">30 Minutes</option>
              <option value="60">60 Minutes</option>
              <option value="90">90 Minutes</option>
              <option value="120">120 Minutes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Introductory Message / Notes</label>
            <textarea
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What would you like to focus on during this session?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Sending Request...' : 'Confirm Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;