import React, { useState, useEffect } from 'react';
import { fetchSkills } from '../../services/skillService';
import SkillCard from '../../components/skills/SkillCard';
import SkillSearch from '../../components/skills/SkillSearch';

const ExploreSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  const loadSkills = async (params = {}) => {
    try {
      setLoading(true);
      const res = await fetchSkills(params);
      setSkills(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleSearch = () => {
    loadSkills({ keyword, category });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Community Skills</h1>
        <p className="text-gray-600">Discover experts ready to teach, or find your next exchange partner.</p>
      </div>

      <SkillSearch
        keyword={keyword}
        setKeyword={setKeyword}
        category={category}
        setCategory={setCategory}
        onSearch={handleSearch}
      />

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading skills...</div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No skills found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <SkillCard key={skill._id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreSkills;