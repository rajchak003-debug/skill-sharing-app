
import React, { useState } from 'react';
import { Calendar, Clock, User, Star, MessageSquare } from 'lucide-react';
import { createReview } from '../../services/reviewService';
import ChatModal from './ChatModal';

const BookingCard = ({ booking, currentUserId, onStatusUpdate }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const isProvider = booking.provider?._id === currentUserId;
  const isLearner = booking.learner?._id === currentUserId;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createReview({
        bookingId: booking._id,
        rating: Number(rating),
        comment,
      });
      setShowReviewModal(false);
      alert('Review submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{booking.skill?.title}</h3>
          {getStatusBadge(booking.status)}
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>{new Date(booking.sessionDate).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>{booking.durationMinutes} minutes</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>{isProvider ? `Learner: ${booking.learner?.name}` : `Provider: ${booking.provider?.name}`}</span>
          </div>
        </div>

        {booking.message && (
          <p className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mb-4 italic">
            "{booking.message}"
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {isProvider && booking.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusUpdate(booking._id, 'accepted')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => onStatusUpdate(booking._id, 'rejected')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Reject
              </button>
            </>
          )}

          {booking.status === 'accepted' && (
            <button
              onClick={() => onStatusUpdate(booking._id, 'completed')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Mark Completed
            </button>
          )}

          {isLearner && booking.status === 'completed' && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center space-x-1"
            >
              <Star className="w-4 h-4" />
              <span>Leave Review</span>
            </button>
          )}
        </div>

        <button
          onClick={() => setShowChatModal(true)}
          className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center space-x-1.5"
        >
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <span>Chat</span>
        </button>
      </div>

      {showChatModal && (
        <ChatModal booking={booking} onClose={() => setShowChatModal(false)} />
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full relative">
            <h4 className="text-lg font-bold mb-4">Rate & Review Session</h4>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  rows="3"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your feedback..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-gray-600 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;