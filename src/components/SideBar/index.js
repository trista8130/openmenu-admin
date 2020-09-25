import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';

import { UserContext } from '../../App';

import './index.scss';
import {
  BarChartOutlined,
  ProfileOutlined,
  ReadOutlined,
  UserOutlined,
  AimOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';

import MerchantServices from '../../service/merchant';

export default function SideBar() {
  const user = useContext(UserContext);
  const { Sider } = Layout;

  const [menuKey, setMenuKey] = useState('1');
  const url = window.location.href.split('/')[3];

  useEffect(() => {
    let arr = menuKey;
    if (url === 'dashboard') {
      arr = '1';
      setMenuKey(arr);
    } else if (url === 'analytics') {
      arr = '2';
      setMenuKey(arr);
    } else if (url === 'customers') {
      arr = '3';
      setMenuKey(arr);
    } else if (url === 'employees') {
      arr = '4';
      setMenuKey(arr);
    } else if (url === 'menu') {
      arr = '5';
      setMenuKey(arr);
    } else if (url === 'profile') {
      arr = '6';
      setMenuKey(arr);
    } else if (url === 'history') {
      arr = '7';
      setMenuKey(arr);
    }
    // switch(url){
    //     case 'analytics':
    //         arr[0]=1;

    // }
  }, [url, menuKey]);

  const [collapsed, setCollapsed] = useState(true);
  // const toggleCollapsed = () => {
  //   setCollapsed(!collapsed);
  // }; //
  const onCollapse = (collapsed) => {
    // console.log(collapsed);
    setCollapsed(collapsed);
  };

  const [merchantInfo, setMerchantInfo] = useState({});
  const merchantId = user.merchantId;
  useEffect(() => {
    const getMerchant = async () => {
      const response = await MerchantServices.handleGetMerchantByMerchantId(
        merchantId
      );
      setMerchantInfo(response.data.data);
    };
    getMerchant();
  }, [merchantId]);

  console.log(user.employeeType);
  return (
    <div className='sidebar'>
      <Sider
        theme='dark'
        breakpoint='lg'
        // collapsedWidth='0'
        style={{ minHeight: '100%' }}
        collapsible
        // onCollapse={toggleCollapsed} //
        collapsed={collapsed}
        onCollapse={onCollapse}

        // onBreakpoint={(broken) => {
        //   console.log(broken);
        // }}
        // onCollapse={(collapsed, type) => {
        //   console.log(collapsed, type);
        // }}
      >
        <div className='logo'>
          {collapsed === true ? (
            <img src={merchantInfo.logo} alt='logo' />
          ) : (
            <div className='logo'>
              <img src={merchantInfo.logo} alt='logo' />
              <h1>{merchantInfo.name}</h1>
            </div>
          )}
        </div>
        <Menu
          triggerSubMenuAction='click'
          theme='dark'
          mode='inline'
          selectedKeys={menuKey}
        >
          <Menu.Item key='1' icon={<ShoppingCartOutlined />}>
            <Link to='/dashboard'>Dashboard</Link>
          </Menu.Item>
          {user.employeeType === 'manager' && (
            <Menu.Item key='2' icon={<BarChartOutlined />}>
              <Link to='/analytics'>Analytics</Link>
            </Menu.Item>
          )}
          <Menu.Item key='7' icon={<FileTextOutlined />}>
            <Link to='/history'>OrderHistory</Link>
          </Menu.Item>

          <Menu.Item key='3' icon={<AimOutlined />}>
            <Link to='/customers'>Customers</Link>
          </Menu.Item>
          {user.employeeType === 'manager' && (
            <Menu.Item key='4' icon={<UserOutlined />}>
              <Link to='/employees'>Employees</Link>
            </Menu.Item>
          )}
          {user.employeeType === 'manager' && (
            <Menu.Item key='5' icon={<ReadOutlined />}>
              <Link to='/menu'>Menu</Link>
            </Menu.Item>
          )}
          {user.employeeType === 'manager' && (
            <Menu.Item key='6' icon={<ProfileOutlined />}>
              <Link to='/profile'>Setting</Link>
            </Menu.Item>
          )}
        </Menu>
        <Button
          type='primary'
          // onClick={toggleCollapsed}
          style={{ marginBottom: 16 }}
        ></Button>
      </Sider>
    </div>
  );
}
