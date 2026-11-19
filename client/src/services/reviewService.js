import API from './api';

export const createReview = async (reviewData) => {
  const response = await API.post('/reviews', reviewData);
  return response.data;
};

export const getSkillReviews = async (skillId) => {
  const response = await API.get(`/reviews/skill/${skillId}`);
  return response.data;
};