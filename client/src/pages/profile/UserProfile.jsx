import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../services/userService';
import { User, CheckCircle } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [skillsWanted, setSkillsWanted] = useState(
    user?.skillsWanted ? user.skillsWanted.join(', ') : ''
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await updateProfile({ name, bio, avatar, skillsWanted });
      setSuccess('Profile updated successfully! Refreshing session...');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
          {avatar ? (
            <img src={avatar} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-600" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl">
              {name?.charAt(0) || <User />}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>{success}</span>
          </div>
        )}
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Image URL</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/my-photo.jpg"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Me / Bio</label>
            <textarea
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the community about your background, experience, and teaching style..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills I Want to Learn (comma-separated)
            </label>
            <input
              type="text"
              value={skillsWanted}
              onChange={(e) => setSkillsWanted(e.target.value)}
              placeholder="e.g., Spanish, Guitar, UI/UX Design"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;