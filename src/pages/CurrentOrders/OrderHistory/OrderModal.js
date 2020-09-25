import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import OrderService from '../../../service/order';
import shortid from 'shortid';

import './OrderModal.scss';

export default function OrderModal({ orderVisible, setOrderVisible, orderId }) {
  const [variants, setVariants] = useState();

  useEffect(() => {
    try {
      const fetchOrder = async () => {
        const response = await OrderService.handleGetOrder(orderId);
        console.log(response);
        console.log(response.data.data);
        if (response.data.success) {
          setVariants(response.data.data.variantId);
        }
      };
      fetchOrder();
    } catch (error) {
      alert(error);
    }
  }, [orderId]);

  const handleCancel = (e) => {
    setOrderVisible(false);
  };

  return (
    <Modal
      title='Order Detail'
      visible={orderVisible}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Back
        </Button>,
      ]}
    >
      <div className='items--container'>
        {variants &&
          variants.map((variant, i) => (
            <div className='items__item--container' key={shortid.generate()}>
              <div className='items--item'>
                <p>{variant.title}</p>
              </div>
              <div className='items--amount'>
                <p>{`x${variant.amount}`}</p>
              </div>
            </div>
          ))}
      </div>
    </Modal>
  );
}
