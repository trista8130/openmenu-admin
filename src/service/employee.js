import axios from 'axios';
import getAPIUrl from '../constants/apiUrl';

const url = getAPIUrl();
const token = window.localStorage.getItem('token');

const handleGetEmployeesByMerchantId = ({ merchantId, page }) => {
  return axios.get(`${url}/employees/merchantId`, {
    params: { merchantId, page },
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

const handleToggleEmployeeActiveness = ({ merchantId, employeeId }) => {
  return axios.put(
    `${url}/employees/active`,
    {
      merchantId,
      employeeId,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
};

const handleDeleteEmployee = ({ employeeId }) => {
  return axios.delete(`${url}/employees/remove`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: { employeeId },
  });
};

const handleUpdateEmployeeProfile = ({ employeeId, employeeName, employeeType, phone }) => {
  return axios.post(
    `${url}/employees/edit`,
    {
      employeeId,
      employeeName,
      employeeType,
      phone
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
};

const handleEmployeeSignUp = ({
  merchantId,
  employeeName,
  employeeType,
  phone,
  password,
}) => {
  return axios.post(`${url}/auth/employee/signup`, {
    merchantId,
    employeeName,
    employeeType,
    phone,
    password,
  });
};

const EmployeeServices = {
  handleGetEmployeesByMerchantId,
  handleToggleEmployeeActiveness,
  handleDeleteEmployee,
  handleUpdateEmployeeProfile,
  handleEmployeeSignUp,
};

export default EmployeeServices;
