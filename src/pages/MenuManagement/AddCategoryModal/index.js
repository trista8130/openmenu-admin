import React, { useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import MenuServices from '../../../service/menu';

export default function AddCategoryModal({
  visible,
  setVisible,
  days,
  format,
  RangePicker,
  times,
  setTimes,
  defaultTimes,
  merchantId,
  categoryUpdate,
  setCategoryUpdate,
}) {
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);

  const handleCancel = () => {
    setExpand(false);
    setTimes(['All Day']);
    setVisible(false);
    setExpand(false);
    form.resetFields();
  };

  const onTimesChange = (dateStrings, i) => {
    setTimes(defaultTimes);
    const newTimes = times;
    newTimes[i] = dateStrings.join('-');
    setTimes(newTimes);
  };

  const onFinish = async () => {
    const row = await form.validateFields();
    const changeData = {
      merchantId: merchantId,
      title: row.title,
      description: row.description,
      avaliableTime: times,
    };
    console.log(changeData);

    try {
      const response = await MenuServices.CreateACategory(changeData);
      console.log(response);
      if (response.data.success) {
        message.success('Successfully created category');
        setTimes(['All Day']);
        setVisible(false);
        setCategoryUpdate(!categoryUpdate);
        setExpand(false);
        form.resetFields();
      }
    } catch (e) {
      alert(e);
    }
  };
  return (
    <Modal
      centered
      visible={visible}
      title='Add A Category'
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
        // {...layout}
        component={false}
        form={form}
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label='Title'
          name='title'
          rules={[{ required: true, message: 'Please input title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Description'
          name='description'
          rules={[{ required: true, message: 'Please input description!' }]}
        >
          <Input />
        </Form.Item>
        <Button
          type='link'
          style={{
            fontSize: 12,
          }}
          onClick={() => {
            setExpand(!expand);
          }}
        >
          {expand ? <UpOutlined /> : <DownOutlined />} Avaliable Time
        </Button>

        {expand
          ? days.map((day, i) => (
              <Form.Item
                label={day}
                name={day}
                key={day}
                rules={[{ required: true, message: 'Please input time!' }]}
              >
                <RangePicker
                  onChange={(data, dateStrings) =>
                    onTimesChange(dateStrings, i)
                  }
                  format={format}
                />
              </Form.Item>
            ))
          : null}
      </Form>
    </Modal>
  );
}
