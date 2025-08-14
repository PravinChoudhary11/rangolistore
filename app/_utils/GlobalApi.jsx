import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://127.0.0.1:1337';

const axiosClient = axios.create({
  baseURL: `${baseURL}/api`,
});

// All API functions
const getCategory = () => axiosClient.get('/categories?populate=*');
const getSliders = () => axiosClient.get('/sliders?populate=*').then(res => res.data.data);
const getSlidersDesktop = () => axiosClient.get('/sliderdesktops?populate=*').then(res => res.data.data);
const getCategoryList = () => axiosClient.get('/categories?populate=*').then(res => res.data.data);
const getAllProducts = () => axiosClient.get('/products?populate=*').then(res => res.data.data);

const searchProducts = (query) =>
  axiosClient
    .get(`/products?filters[name][$contains]=${query}&populate=*`)
    .then(res => res.data.data)
    .catch(err => {
      console.error('Search Products Error:', err);
      return [];
    });

const searchCategories = (query) =>
  axiosClient
    .get(`/categories?filters[name][$contains]=${query}&populate=*`)
    .then(res => res.data.data)
    .catch(err => {
      console.error('Search Categories Error:', err);
      return [];
    });

export default {
  getCategory,
  getSliders,
  getSlidersDesktop,
  getCategoryList,
  getAllProducts,
  searchProducts,
  searchCategories,
};
