import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

export const reviewCode = async (payload) => {
  const response = await client.post('/review', payload);
  return response.data;
};

export const fetchReviews = async () => {
  const response = await client.get('/reviews');
  return response.data;
};

export const fetchAnalytics = async () => {
  const response = await client.get('/analytics');
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await client.delete(`/review/${id}`);
  return response.data;
};
