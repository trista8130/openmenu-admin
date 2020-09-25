import axios from 'axios';
import getAPIUrl from '../constants/apiUrl';

const url = getAPIUrl();

const handleGetCategoryByMerchantId = (merchantId) => {
  return axios.get(`${url}/categories/merchant`, {
    params: { merchantId },
  });
};
const DeleteCategoryByCategoryId = (categoryId) => {
  return axios.delete(`${url}/categories/`, {
    data: { categoryId },
  });
};
const UpsertCategoryByCategoryId = (data) => {
  return axios.post(`${url}/categories/category`, data);
};
const CreateACategory = (data) => {
  return axios.post(`${url}/categories/`, data);
};

const GetItemsByMerchantId = (merchantId) => {
  return axios.get(`${url}/categories/menu`, {
    params: { merchantId },
  });
};
const uploadItemImageById = (itemId, link) => {
  return axios.put(`${url}/items/image`, { itemId, link });
};

const updateItemById = (data) => {
  return axios.put(`${url}/items/`, data);
};

const addItem = (data) => {
  return axios.post(`${url}/items/`, data);
};

const deleteItemByItemId = (itemId) => {
  return axios.delete(`${url}/items/`, {
    data: { itemId },
  });
};

const getVariantsByMerchantId = (merchantId) => {
  return axios.get(`${url}/variants/merchant`, {
    params: { merchantId },
  });
};

const updateVariantById = (data) => {
  return axios.put(`${url}/variants/`, data);
};

const deleteVariantByVariantId = (variantId) => {
  return axios.delete(`${url}/variants/`, {
    data: { variantId },
  });
};

const addVariant = (data) => {
  return axios.post(`${url}/variants/`, data);
};

const MenuServices = {
  handleGetCategoryByMerchantId,
  DeleteCategoryByCategoryId,
  UpsertCategoryByCategoryId,
  CreateACategory,
  GetItemsByMerchantId,
  uploadItemImageById,
  updateItemById,
  addItem,
  deleteItemByItemId,
  getVariantsByMerchantId,
  updateVariantById,
  deleteVariantByVariantId,
  addVariant
};

export default MenuServices;
