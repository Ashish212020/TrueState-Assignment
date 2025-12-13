import axios from 'axios';
const API_URL = 'http://localhost:5000/api/transactions';

export const fetchTransactions = async (params) => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};