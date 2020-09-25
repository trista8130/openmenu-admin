import React from 'react';
import { Link } from 'react-router-dom';
import SideBar from '../../components/SideBar';
import { Layout } from 'antd';
import './index.css';

export default function PageNotFound() {
  const imgUrl =
    'https://res.cloudinary.com/dlapk94rx/image/upload/v1594763165/HTML-404-Page-with-SVG_r0qztr.png';
  const { Content } = Layout;

  return (
    <Layout>
      <SideBar />
      <Content style={{ margin: '24px 16px 0' }}>
        <div className='PageNotFound'>
          <img src={imgUrl} alt='' />
          <h1>Oops! That Page Can Not Be Found!</h1>
          <Link to='/analytics'>
            <button>
              Go to home page
            </button>
          </Link>
        </div>
      </Content>
    </Layout>
  );
}
