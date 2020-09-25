import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Select, Checkbox } from 'antd';

import MenuServices from '../../../service/menu';
import FileService from '../../../service/file';

export default function AddItemModal({
  merchantId,
  itemVisible,
  setItemVisible,
  itemUpdate,
  setItemUpdate,
  categoryUpdate,
}) {
  const { Option } = Select;

  const [form] = Form.useForm();
  const itemType = ['isVegan', 'isSpicy', 'isHalal', 'isGlutenFree'];
  const [categories, setCategories] = useState([]);
  const [link, setLink] = useState('');
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await MenuServices.handleGetCategoryByMerchantId(
          merchantId
        );
        setCategories(response.data.data.result);
      } catch (e) {
        alert(e);
      }
    };
    fetchCategories();
  }, [merchantId, categoryUpdate]);

  const handleCreateLink = async (file) => {
    const formData = new FormData();
    formData.append('item', file[0]);
    try {
      const uploaded = await FileService.createItemImage(formData);
      if (uploaded.data.success) {
        setLink(uploaded.data.data);
        message.info('Uploaded image is ready!');
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleCancel = () => {
    setItemVisible(false);
    form.resetFields();
  };

  const onFinish = async () => {
    const row = await form.validateFields();
    const checkedType = row.type;
    console.log(checkedType);
    let type = {
      isGlutenFree: false,
      isHalal: false,
      isSpicy: false,
      isVegan: false,
    };
    checkedType &&
      checkedType.map((v) => {
        return (type = { ...type, [v]: true });
      });
    const data = { ...row, image: link, type };
    console.log(data);
    const response = await MenuServices.addItem(data);
    console.log(response);
    if (response.data.success) {
      message.success('Successfully created item');
    }
    setItemVisible(false);
    setItemUpdate(!itemUpdate);
    form.resetFields();
  };

  return (
    <Modal
      centered
      visible={itemVisible}
      title='Add A Item'
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
          name='categoryId'
          label='Category'
          rules={[{ required: true, message: 'Please choose category!' }]}
        >
          <Select placeholder='Please choose category'>
            {categories.map((v) => (
              <Option key={v.categoryInfo._id} value={v.categoryInfo._id}>
                {v.categoryInfo.title}
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

        <Form.Item name='type' label='Type'>
          <Checkbox.Group options={itemType}/>
        </Form.Item>
        <Form.Item name='image' label='Image'>
          <Input
            type='file'
            onChange={(e) => handleCreateLink(e.target.files)}
            // ref={inputRef}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
