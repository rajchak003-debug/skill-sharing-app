import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSkillById, updateSkill } from '../../services/skillService';

const EditSkill = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    proficiencyLevel: 'Intermediate',
    locationType: 'Online',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = ['Technology', 'Languages', 'Music', 'Design', 'Cooking', 'Business', 'Fitness', 'Other'];

  useEffect(() => {
    const loadSkill = async () => {
      try {
        const res = await fetchSkillById(id);
        const s = res.data;
        setFormData({
          title: s.title,
          description: s.description,
          category: s.category,
          proficiencyLevel: s.proficiencyLevel,
          locationType: s.locationType,
        });
      } catch (err) {
        console.error(err);
        alert('Failed to load skill details');
      } finally {
        setLoading(false);
      }
    };
    loadSkill();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('proficiencyLevel', formData.proficiencyLevel);
      data.append('locationType', formData.locationType);

      for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]);
      }

      await updateSkill(id, data);
      navigate('/my-skills');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update skill');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading skill...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Skill Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skill Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
            <select
              name="proficiencyLevel"
              value={formData.proficiencyLevel}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
            <select
              name="locationType"
              value={formData.locationType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Online">Online</option>
              <option value="In-Person">In-Person</option>
              <option value="Both">Both</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            required
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Replace Images (Optional, Max 3)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/my-skills')}
            className="w-1/3 bg-gray-100 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="w-2/3 bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
          >
            {saving ? 'Saving Changes...' : 'Update Skill Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSkill;