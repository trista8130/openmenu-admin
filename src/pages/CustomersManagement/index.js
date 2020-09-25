import React, { useState, useEffect, useContext } from 'react';
import { Button, Descriptions, Layout, Table } from 'antd';
import SideBar from '../../components/SideBar';
import UserServices from '../../service/user';
import { UserContext } from '../../App';
import Modal from 'antd/lib/modal/Modal';
import shortid from 'shortid';

export default function CustomersManagementPage() {
  const { Content } = Layout;
  const user = useContext(UserContext);
  const merchantId = user.merchantId;
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserServices.getUsersByMerchantId(merchantId);
        console.log(response.data.data.result);
        setUsers(response.data.data.result);
      } catch (e) {
        alert(e);
      }
    };
    fetchUsers();
  }, [merchantId]);

  const data = [];
  users &&
    users.map((v, i) => {
      if (i > 0 && users[i]._id === users[i - 1]._id) {
        return null;
      } else
        return data.push({
          key: `user${i}`,
          name: v.userName,
          phone: v.phone,
          userId: v._id,
        });
    });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
  ];
  const handleShowModal = (id) => {
    setOrderId(id);
    setVisible(true);
  };
  const handleCancel = () => {
    setOrderId(null);
    setVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar />
      <Content style={{ margin: '24px 16px 0' }}>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          expandable={{
            expandedRowRender: (record) =>
              users &&
              users.map(
                (v, i) =>
                  record.userId === v._id && (
                    <Button
                      key={shortid.generate()}
                      type='link'
                      style={{
                        marginLeft: 30,
                        // borderBottom: '1px solid #f0f0f0',
                      }}
                      onClick={() => {
                        handleShowModal(v.orderList._id);
                      }}
                    >
                      {v.orderList._id}
                    </Button>
                  )
              ),
          }}
        />
      </Content>
      <Modal
        centered
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key='back' type='primary' onClick={handleCancel}>
            Ok
          </Button>,
        ]}
      >
        {users &&
          users.map(
            (v) =>
              orderId === v.orderList._id && (
                <Descriptions
                  title='Order details'
                  bordered
                  key={shortid.generate()}
                >
                  <Descriptions.Item label='Date' span={2}>
                    {v.paymentList.date}
                  </Descriptions.Item>
                  <Descriptions.Item label='Type'>
                    {v.orderList.type}
                  </Descriptions.Item>
                  <Descriptions.Item label='Status'>
                    {v.orderList.status}
                  </Descriptions.Item>
                  <Descriptions.Item label='Items' span={2}>
                    {v.orderList.variantId.map((o) => (
                      <p
                        key={shortid.generate()}
                      >{`${o.title} * ${o.amount}`}</p>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label='Tax'>
                    {v.paymentList.tax.$numberDecimal}
                  </Descriptions.Item>
                  <Descriptions.Item label='Total'>
                    {v.paymentList.total.$numberDecimal}
                  </Descriptions.Item>
                </Descriptions>
              )
          )}
      </Modal>
    </Layout>
  );
}
