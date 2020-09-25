import axios from 'axios';
import getAPIUrl from '../constants/apiUrl';

const url = getAPIUrl();

const createItemImage = (data) => {
  return axios.post(`${url}/files/item/image`, data);
};

const uploadMerchantLogo = (data) => {
  return axios.post(`${url}/files/logo`, data);
};

const uploadMerchantImages = (data) => {
  console.log(data);
  return axios.post(`${url}/files/merchant/images`, data);
};

const FileService = {
  createItemImage,
  uploadMerchantLogo,
  uploadMerchantImages,
};

export default FileService;
