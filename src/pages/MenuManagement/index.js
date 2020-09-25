import React, { useContext, useState } from 'react';
import { Layout, Tabs } from 'antd';
import SideBar from '../../components/SideBar';
import './index.scss';
import CategoryList from './CategoryList';
import ItemList from './ItemList';
import VariantList from './VariantList';
import { UserContext } from '../../App';

export default function MenuManagementPage() {
  const { Content } = Layout;
  const { TabPane } = Tabs;
  const user = useContext(UserContext);
  const merchantId = user.merchantId;
  const [categoryUpdate, setCategoryUpdate] = useState(false);
  const [itemUpdate, setItemUpdate] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar />
      <Content style={{ margin: '24px 16px 0' }}>
        <div className='menu__page site-layout-background'>
          <div className='card-container'>
            <Tabs type='card' defaultActiveKey='1'>
              <TabPane tab='Category' key='1'>
                <CategoryList
                  merchantId={merchantId}
                  categoryUpdate={categoryUpdate}
                  setCategoryUpdate={setCategoryUpdate}
                />
              </TabPane>
              <TabPane tab='Item' key='2'>
                <ItemList
                  merchantId={merchantId}
                  categoryUpdate={categoryUpdate}
                  itemUpdate={itemUpdate}
                  setItemUpdate={setItemUpdate}
                />
              </TabPane>
              <TabPane tab='Variant' key='3'>
                <VariantList merchantId={merchantId} itemUpdate={itemUpdate} />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
