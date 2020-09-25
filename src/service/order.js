import axios from 'axios';
import getAPIUrl from '../constants/apiUrl';

const url = getAPIUrl();


const handleGetOrderByMerchantId = (merchantId, page) => {
  return axios.get(`${url}/orders/merchant`, {
    params: {
      merchantId,
      page,
    },
  });
};

const handleGetOrderByMerchantIdAndDate = (
  merchantId,
  page,
  dateRange,
  rangeAmount
) => {
  return axios.get(`${url}/orders/merchant/date`, {
    params: {
      merchantId,
      page,
      dateRange,
      rangeAmount,
    },
  });
};

const handleGetTodayOrderStatusByMerchantId = (merchantId, status, page) => {
  return axios.get(`${url}/orders/merchant/status`, {
    params: {
      merchantId,
      status,
      page,
    },
  });
};
const handleChangeOrderStatus = (orderId, status) => {
  return axios.put(`${url}/orders/status`, { orderId, status });
};

const handleGetPaymentsByMerchanId = (merchantId) => {
  return axios.get(`${url}/payments/merchant`, {
    params: {
      merchantId,
    },
  });
};
const handleGetPaymentsByMerchanIdInDateRange = (
  merchantId,
  rangeAmount,
  dateRange
) => {
  return axios.get(`${url}/payments/date`, {
    params: {
      merchantId,
      rangeAmount,
      dateRange,
    },
  });
};

const handleGetOrder = (orderId) => {
  return axios.get(`${url}/orders/order`, {
    params: {
      orderId,
    },
  });
};

const OrderService = {
  handleGetOrderByMerchantId,
  handleGetOrderByMerchantIdAndDate,
  handleGetTodayOrderStatusByMerchantId,
  handleChangeOrderStatus,
  handleGetPaymentsByMerchanId,
  handleGetPaymentsByMerchanIdInDateRange,
  handleGetOrder,
};

export default OrderService;
