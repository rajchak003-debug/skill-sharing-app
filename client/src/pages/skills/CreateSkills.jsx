import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillForm from '../../components/skills/SkillForm';
import { createSkill } from '../../services/skillService';

const CreateSkill = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (skillData) => {
    try {
      setLoading(true);
      await createSkill(skillData);
      navigate('/dashboard/myskills');
    } catch (err) {
      console.error(err);
      alert('Failed to create skill listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">List a New Skill</h1>
      <SkillForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
};

export default CreateSkill;