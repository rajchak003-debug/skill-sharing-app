import React, { useState } from 'react';

const SkillForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    proficiencyLevel: 'Intermediate',
    locationType: 'Online',
  });
  const [images, setImages] = useState([]);

  const categories = ['Technology', 'Languages', 'Music', 'Design', 'Cooking', 'Business', 'Fitness', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('proficiencyLevel', formData.proficiencyLevel);
    data.append('locationType', formData.locationType);

    for (let i = 0; i < images.length; i++) {
      data.append('images', images[i]);
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Skill Title</label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Full-Stack Web Development with React"
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
          placeholder="Describe what you will teach, prerequisites, and session structure..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Max 3)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
      >
        {loading ? 'Publishing Skill...' : 'Publish Skill Listing'}
      </button>
    </form>
  );
};

export default SkillForm;