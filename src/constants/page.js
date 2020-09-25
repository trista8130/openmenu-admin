import React from 'react';
import { Redirect } from 'react-router-dom';
import AnalyticsPage from '../pages/Analytics';
import CurrentOrdersPage from '../pages/CurrentOrders';
import CustomersManagementPage from '../pages/CustomersManagement';
import EmployeesManagementPage from '../pages/EmployeesManagement';
import MenuManagementPage from '../pages/MenuManagement';
import MerchantProfilePage from '../pages/MerchantProfile';
import OrderHistoryPage from '../pages/CurrentOrders/OrderHistory';

const token = window.localStorage.getItem('token');
const ProtectPage = [
  {
    path: '/analytics',
    component: token ? <AnalyticsPage /> : <Redirect to='/' />,
    isExact: true,
  },
  {
    path: '/dashboard',
    component: token ? <CurrentOrdersPage /> : <Redirect to='/' />,
    isExact: true,
  },
  {
    path: '/customers',
    component: token ? <CustomersManagementPage /> : <Redirect to='/' />,
    isExact: true,
  },
  {
    path: '/employees',
    component: token ? <EmployeesManagementPage /> : <Redirect to='/' />,
    isExact: true,
  },
  {
    path: '/menu',
    component: token ? <MenuManagementPage /> : <Redirect to='/' />,
    isExact: true,
  },
  {
    path: '/profile',
    component: token ? <MerchantProfilePage /> : <Redirect to='/' />,
    isExact: true,
  },
  {
    path: '/history',
    component: token ? <OrderHistoryPage /> : <Redirect to='/' />,
    isExact: true,
  },
];

export default ProtectPage;
