import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import AuthServices from '../../service/auth';

import './index.scss';

export default function LoginPage({ history }) {
  const handleLogin = async (values) => {
    try {
      const response = await AuthServices.handleEmployeeLogin(values);
      if (response.data.success) {
        window.localStorage.setItem('token', response.data.data);
        history.push('/dashboard');
      }
    } catch (e) {
      alert(e.message);
    }
  }
  return (
    <div className="login_form_container">
      <h4>Log In</h4>
      <Form name='normal_login' onFinish={handleLogin}>
        <Form.Item
          name='phone'
          rules={[
            {
              required: true,
              message: 'Please input your phone!',
            }
          ]}
        >
          <Input
            prefix={<UserOutlined className='site-form-item-icon' />}
            placeholder='Phone'
          />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[{
            required: true,
            message: 'Please input your Password'
          }]}
        >
          <Input prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='Password'
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>Log In</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
