import axios from 'axios';
import getAPIUrl from '../constants/apiUrl';

const url = getAPIUrl();
const token = window.localStorage.getItem('token');

const handleGetMerchantByMerchantId = (merchantId) => {
  return axios.get(`${url}/merchants/merchant`, {
    params: { merchantId },
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

const handleProfileUpdate = ({
  merchantId,
  name,
  description,
  openTime,
  street,
  city,
  state,
  zipCode,
  types,
}) => {
  return axios.put(
    `${url}/merchants`,
    {
      merchantId,
      name,
      description,
      openTime,
      street,
      city,
      state,
      zipCode,
      types,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
};

const handleLogoUpdate = ({ merchantId, logo }) => {
  return axios.put(
    `${url}/merchants/logo`,
    {
      merchantId,
      logo,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
};

const handleMerchantImagesUpdate = ({ merchantId, images }) => {
  return axios.put(
    `${url}/merchants/images`,
    {
      merchantId,
      images,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
};

const MerchantServices = {
  handleGetMerchantByMerchantId,
  handleProfileUpdate,
  handleLogoUpdate,
  handleMerchantImagesUpdate,
};

export default MerchantServices;
