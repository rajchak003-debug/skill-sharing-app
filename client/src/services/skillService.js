import API from './api';

export const fetchSkills = async (params = {}) => {
  const response = await API.get('/skills', { params });
  return response.data;
};

export const fetchSkillById = async (id) => {
  const response = await API.get(`/skills/${id}`);
  return response.data;
};

export const createSkill = async (skillData) => {
  const response = await API.post('/skills', skillData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
export const fetchMySkills = async () => {
  const response = await API.get('/skills/my-skills');
  return response.data;
};
export const updateSkill = async (id, skillData) => {
  const response = await API.put(`/skills/${id}`, skillData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteSkill = async (id) => {
  const response = await API.delete(`/skills/${id}`);
  return response.data;
};