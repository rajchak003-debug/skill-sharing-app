
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMySkills, deleteSkill } from '../../services/skillService';
import { Trash2, PlusCircle, Star, ExternalLink, Edit } from 'lucide-react';

const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMySkills = async () => {
    try {
      setLoading(true);
      const res = await fetchMySkills();
      setSkills(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMySkills();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill listing?')) return;
    try {
      await deleteSkill(id);
      setSkills(skills.filter((skill) => skill._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete skill');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading your skills...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Posted Skills</h1>
          <p className="text-gray-600 mt-1">Manage the skills you offer to the community.</p>
        </div>
        <Link
          to="/skills/new"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 flex items-center space-x-2 shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post New Skill</span>
        </Link>
      </div>

      {skills.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">You haven't posted any skills yet.</p>
          <Link
            to="/skills/new"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700"
          >
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div key={skill._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold uppercase px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                    {skill.category}
                  </span>
                  <span className="flex items-center text-sm font-semibold text-amber-600">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {skill.rating > 0 ? skill.rating.toFixed(1) : 'New'} ({skill.numReviews})
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{skill.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{skill.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  to={`/skills/${skill._id}`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1"
                >
                  <span>View Listing</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <div className="flex items-center space-x-1">
                  <Link
                    to={`/skills/edit/${skill._id}`}
                    className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    title="Edit Skill"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete Skill"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySkills;