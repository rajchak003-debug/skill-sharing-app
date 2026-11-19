import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSkillById } from '../../services/skillService';
import { getSkillReviews } from '../../services/reviewService';
import BookingModal from '../../components/bookings/BookingModal';
import { useAuth } from '../../hooks/useAuth';
import { Star, MapPin, User, Calendar } from 'lucide-react';

const SkillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [skill, setSkill] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [skillRes, reviewRes] = await Promise.all([
          fetchSkillById(id),
          getSkillReviews(id),
        ]);
        setSkill(skillRes.data);
        setReviews(reviewRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading skill details...</div>;
  if (!skill) return <div className="text-center py-20 text-gray-500">Skill not found.</div>;

  const isOwner = user && skill.owner?._id === user._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 p-8 mb-8">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-semibold uppercase tracking-wider px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
            {skill.category}
          </span>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded">
              {skill.proficiencyLevel} • {skill.locationType}
            </span>
            {skill.rating > 0 && (
              <span className="flex items-center text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded">
                <Star className="w-4 h-4 mr-1 fill-current" />
                {skill.rating.toFixed(1)} ({skill.numReviews})
              </span>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{skill.title}</h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-8">{skill.description}</p>

        {skill.images && skill.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {skill.images.map((img, index) => (
              <img key={index} src={img} alt="Skill showcase" className="rounded-xl object-cover h-64 w-full shadow" />
            ))}
          </div>
        )}

        <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {skill.owner?.avatar ? (
              <img src={skill.owner.avatar} alt={skill.owner.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                {skill.owner?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-900">{skill.owner?.name}</h3>
              <p className="text-sm text-gray-500">{skill.owner?.email}</p>
            </div>
          </div>

          {!isOwner && user && (
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex items-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Request Booking Session</span>
            </button>
          )}

          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="bg-gray-800 text-white font-medium px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors shadow-md"
            >
              Login to Book Session
            </button>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet for this skill.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div key={rev._id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{rev.reviewer?.name}</span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showBookingModal && (
        <BookingModal
          skill={skill}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => navigate('/bookings')}
        />
      )}
    </div>
  );
};

export default SkillDetails;