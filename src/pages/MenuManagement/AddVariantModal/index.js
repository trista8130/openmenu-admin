import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  message,
  Select,
  InputNumber,
} from 'antd';

import MenuServices from '../../../service/menu';

export default function AddVariantModal({
  merchantId,
  variantVisible,
  setVariantVisible,
  variantUpdate,
  setVariantUpdate,
  itemUpdate
}) {
  const { Option } = Select;

  const [form] = Form.useForm();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await MenuServices.GetItemsByMerchantId(merchantId);
        console.log(response.data.data.result);
        setItems(response.data.data.result);
      } catch (e) {
        alert(e);
      }
    };
    fetchItems();
  }, [merchantId,itemUpdate]);

  const data = [];

  items &&
    items.map((v, i) => {
      if (i > 0 && items[i].itemStringId === items[i - 1].itemStringId) {
        return null;
      } else
        return data.push({
          key: i,
          itemId: v.itemInfo._id,
          title: v.itemInfo.title,
        });
    });

  const handleCancel = () => {
    setVariantVisible(false);
    form.resetFields();
  };

  const onFinish = async () => {
    const row = await form.validateFields();
    if (typeof row.price === 'number') {
      row.price = row.price.toFixed(2);
    }
    console.log(row);

    const response = await MenuServices.addVariant(row);

    if (response.data.success) {
      message.success('Successfully created variant');
    }
    setVariantVisible(false);
    setVariantUpdate(!variantUpdate);
    form.resetFields();
  };

  return (
    <Modal
      centered
      visible={variantVisible}
      title='Add A Variant'
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={onFinish}>
          Submit
        </Button>,
      ]}
    >
      <Form
        form={form}
        component={false}
        name='validate_other'
        // {...formItemLayout}
        onFinish={onFinish}
        size='large'
      >
        <Form.Item
          name='itemId'
          label='Item'
          rules={[{ required: true, message: 'Please choose item!' }]}
        >
          <Select placeholder='Please choose item'>
            {data &&
              data.map((v) => (
                <Option key={v.itemId} value={v.itemId}>
                  {v.title}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name='title'
          label='Title'
          rules={[{ required: true, message: 'Please Input title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='description'
          label='Description'
          rules={[{ required: true, message: 'Please Input description!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='price'
          label='Price'
          rules={[{ required: true, message: 'Please Input price!' }]}
        >
          <InputNumber min={0} step={0.01} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
