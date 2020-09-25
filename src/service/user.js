import axios from 'axios';
import getAPIUrl from '../constants/apiUrl';

const url = getAPIUrl();

const getUsersByMerchantId = (merchantId) => {
  return axios.get(`${url}/users/merchant`, {
    params: { merchantId },
  });
};

const UserServices = {
getUsersByMerchantId
};

export default UserServices;