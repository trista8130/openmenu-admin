import React from 'react';
import { Layout } from 'antd';
import './index.scss';

const { Header } = Layout;

export default function NavBar({ user }) {
    console.log(user.merchantId);
    return (
        <Header className='header' style={{ color: 'white' }}>
            {user.merchantId}
        </Header>
    )
}