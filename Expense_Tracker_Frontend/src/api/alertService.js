import axiosInstance from './axiosInstance';

export const fetchAlerts = async () => {
  const res = await axiosInstance.get('/notification/alerts');
  return Array.isArray(res.data?.data) ? res.data.data : [];
};
