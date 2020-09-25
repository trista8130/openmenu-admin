import React, { useState, useEffect } from 'react';
import SideBar from '../../../components/SideBar/index';
import OrderService from '../../../service/order';
import { Layout, Table, Button } from 'antd';
import shortid from 'shortid';
import './index.scss';
import { DownOutlined } from '@ant-design/icons';
import OrderModal from './OrderModal.js';

export default function OrderHistoryPage() {
  const { Content } = Layout;
  const { Column } = Table;
  const merchantId = 123;

  const [payments, setPayments] = useState();
  useEffect(() => {
    try {
      const fetchPayments = async () => {
        const response = await OrderService.handleGetPaymentsByMerchanId(
          merchantId
        );
        if (response.data.success) {
          const paymentsArr = response.data.data.map((payment) => {
            payment.tableTitle = payment.table[0].title;
            return payment;
          });
          setPayments(paymentsArr);
        }
      };
      fetchPayments();
    } catch (error) {
      alert(error);
    }
  }, []);

  const handleDateRange = async (value) => {
    const { dateRange, rangeAmount } = value;
    const response = await OrderService.handleGetPaymentsByMerchanIdInDateRange(
      merchantId,
      dateRange,
      rangeAmount
    );
    if (response.data.success) {
      const paymentsArr = response.data.data.map((payment) => {
        payment.tableTitle = payment.table[0].title;
        return payment;
      });
      setPayments(paymentsArr);
    }
  };

  const [orderVisible, setOrderVisible] = useState(false);
  const [order, setOrder] = useState();

  return (
    <Layout>
      <SideBar />
      <Content style={{ margin: '24px 16px 0' }}>
        <div className='order-history-container'>
          <h1>Payment history</h1>
          <Table dataSource={payments} rowKey={shortid.generate}>
            <Column title='PaymentId' dataIndex='_id' key='orderId' />
            <Column title='Table' dataIndex='tableTitle' key='tableId' />
            <Column
              title='Date'
              dataIndex='date'
              key='date'
              defaultSortOrder='descend'
              sorter={(a, b) => a.epoch - b.epoch}
              filterIcon={(filtered) => (
                <DownOutlined
                  style={{ color: filtered ? '#1890ff' : undefined }}
                />
              )}
              filterDropdown={() => (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 8,
                  }}
                >
                  <Button
                    type='link'
                    onClick={() =>
                      handleDateRange({ dateRange: 'days', rangeAmount: 7 })
                    }
                  >
                    Past 7 Days
                  </Button>
                  <Button
                    type='link'
                    onClick={() =>
                      handleDateRange({ dateRange: 'weeks', rangeAmount: 2 })
                    }
                  >
                    Past 2 Weeks
                  </Button>
                  <Button
                    type='link'
                    onClick={() =>
                      handleDateRange({ dateRange: 'months', rangeAmount: 1 })
                    }
                  >
                    Past 1 Months
                  </Button>
                </div>
              )}
            />
            <Column title='Total' dataIndex='total' key='total' />
            <Column
              title='OrderId'
              dataIndex='orderId'
              key='orderId'
              render={(text, record) => (
                <div>
                  <Button
                    type='link'
                    onClick={() => {
                      setOrderVisible(true);
                      setOrder(record.orderId);
                    }}
                  >
                    {record.orderId}
                  </Button>
                </div>
              )}
            />
          </Table>
          <OrderModal
            orderVisible={orderVisible}
            setOrderVisible={setOrderVisible}
            orderId={order}
          />
        </div>
      </Content>
    </Layout>
  );
}
