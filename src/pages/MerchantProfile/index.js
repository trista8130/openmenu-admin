import React, { useState, useContext, useEffect } from 'react';
import {
  Layout,
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  Space,
  TimePicker,
  message,
} from 'antd';
import SideBar from '../../components/SideBar';
import InfoOptions from './formInputs';
import shortid from 'shortid';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './index.scss';
import MerchantServices from '../../service/merchant';
import FileService from '../../service/file';
import { UserContext } from '../../App';
import moment from 'moment';

export default function MerchantProfilePage() {
  const { Content } = Layout;
  const { Option } = Select;
  const format = 'HH:mm';
  const [form] = Form.useForm();
  const { RangePicker } = TimePicker;
  const user = useContext(UserContext);

  const [logoLink, setLogoLink] = useState('');
  const [imageLinks, setimageLinks] = useState([]);
  const [merchantInfo, setMerchantInfo] = useState({});

  const businessTypes = ['DineIn', 'TakeOut'];
  const ZERO = 0;

  const merchantId = user.merchantId;
  const getMerchant = async () => {
    const response = await MerchantServices.handleGetMerchantByMerchantId(
      merchantId
    );
    setMerchantInfo(response.data.data);
  };

  useEffect(() => {
    getMerchant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId]);

  const onFinish = async (values) => {
    // const row = await form.validateFields();
    // console.log(row);
    try {
      const {
        name,
        description,
        openTime,
        types,
        street,
        city,
        state,
        zipCode,
      } = values;
      const response = await MerchantServices.handleProfileUpdate({
        merchantId: user.merchantId,
        name,
        description,
        openTime,
        types,
        street,
        city,
        state,
        zipCode,
      });
      if (response.data.success) {
        message.info('Update successfully!');
        getMerchant();
      } else {
        alert(response.data.data);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  if (merchantInfo.openTime) {
    const localeTime = merchantInfo.openTime.map((data) => {
      return {
        week: data.week,
        hoursRange: data.hoursRange.map((timeLine) => {
          return moment.utc(timeLine).local().format('HH:mm');
        }),
      };
    });
    merchantInfo.openTime = localeTime;
  }

  let newOpenTime = [];
  merchantInfo.openTime &&
    merchantInfo.openTime.length > 1 &&
    merchantInfo.openTime.map((v) => {
      newOpenTime.push({
        week: v.week,
        hoursRange: [
          moment(v.hoursRange[0], format),
          moment(v.hoursRange[1], format),
        ],
      });
      return newOpenTime;
    });

  useEffect(() => {
    form.setFieldsValue({
      name: merchantInfo.name,
      description: merchantInfo.description,
      street: merchantInfo.street,
      city: merchantInfo.city,
      state: merchantInfo.state,
      zipCode: merchantInfo.zipCode,
      types: merchantInfo.types,
      openTime: newOpenTime,
    });
  }, [merchantInfo, form, newOpenTime]);

  const handleLogoUpdate = async () => {
    try {
      const response = await MerchantServices.handleLogoUpdate({
        merchantId: user.merchantId,
        logo: logoLink,
      });
      if (response.data.success) {
        message.info('Update successfully!');
        getMerchant();
      } else {
        alert(response.data.data);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const handleImagesUpdate = async () => {
    try {
      const response = await MerchantServices.handleMerchantImagesUpdate({
        merchantId: user.merchantId,
        images: imageLinks,
      });
      if (response.data.success) {
        message.info('Update successfully!');
        getMerchant();
      } else {
        alert(response.data.data);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const handleLogoUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('logo', file);
      const uploadResult = await FileService.uploadMerchantLogo(formData);
      if (uploadResult.data.success) {
        setLogoLink(uploadResult.data.data);
        message.info('Uploaded logo is ready!');
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleImagesUpload = async (e) => {
    try {
      const formData = new FormData();
      for (let i = ZERO; i < e.target.files.length; i++) {
        formData.append('merchant', e.target.files[i]);
      }
      const uploadResult = await FileService.uploadMerchantImages(formData);
      if (uploadResult.data.success) {
        setimageLinks(uploadResult.data.data);
        message.info('Uploaded images is ready!');
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar />
      <Content style={{ margin: '24px 16px 0' }}>
        <Form
          form={form}
          onFinish={onFinish}
          layout='vertical'
          autoComplete='off'
          name='time_related_controls'
        >
          <Form.Item
            name='name'
            label='Name'
            rules={[
              { required: true, message: 'Please input your business name!' },
            ]}
          >
            <Input placeholder='Name' />
          </Form.Item>
          <Form.Item name='description' label='Description'>
            <Input placeholder='Description' />
          </Form.Item>
          <Form.Item name='street' label='Street'>
            <Input placeholder='Street' />
          </Form.Item>
          <Form.Item name='city' label='City'>
            <Input placeholder='City' />
          </Form.Item>
          <Form.Item name='state' label='State'>
            <Select placeholder='State' allowClear>
              {InfoOptions.stateOptions.map((stateOption) => (
                <Option key={shortid.generate()} value={stateOption.title}>
                  {stateOption.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='zipCode' label='ZIP'>
            <Input placeholder='ZIP' />
          </Form.Item>
          <Form.List name='openTime' label='Hours'>
            {(fields, { add, remove }) => {
              return (
                <div>
                  <p>Hours</p>
                  {fields.map((field, i) => (
                    <Space
                      key={field.key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align='start'
                    >
                      <Form.Item
                        {...field}
                        fieldKey={[field.fieldKey, 'week']}
                        rules={[{ required: true, message: 'Missing Week' }]}
                        name={[field.name, 'week']}
                      >
                        <Select
                          placeholder='Day'
                          // defaultValue='Mon'
                          style={{ width: 119 }}
                        >
                          {InfoOptions.weekOptions.map((weekOption) => (
                            <Option
                              key={shortid.generate()}
                              value={weekOption.title}
                            >
                              {weekOption.title}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        fieldKey={[field.fieldKey, 'hoursRange']}
                        rules={[{ required: true, message: 'Missing Time' }]}
                        name={[field.name, 'hoursRange']}
                      >
                        <RangePicker format={format} />
                      </Form.Item>
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type='dashed'
                      onClick={() => {
                        add();
                      }}
                      block
                    >
                      <PlusOutlined /> Add Hours
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>

          <Form.Item label='Type' name='types'>
            <Checkbox.Group options={businessTypes} />
          </Form.Item>

          <Form.Item>
            <Button htmlType='submit' type='primary'>
              Submit
            </Button>
          </Form.Item>
        </Form>
        <div className='merchant-logo'>
          <p>Logo</p>
          <Input type='file' onChange={handleLogoUpload} required />
          <Button type='primary' onClick={handleLogoUpdate}>
            Submit
          </Button>
        </div>
        <div className='merchant-img'>
          <p>Images</p>
          <Input type='file' onChange={handleImagesUpload} multiple />
          <Button type='primary' onClick={handleImagesUpdate}>
            Submit
          </Button>
        </div>
      </Content>
    </Layout>
  );
}
