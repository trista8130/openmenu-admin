import React from 'react';
import { Form, Input, Modal, Button, Select } from 'antd';
import EmployeeServices from '../../service/employee';
import shortid from 'shortid';

export default function CreateModal({
  handleCancel,
  visibleCreate,
  merchantId,
  employees,
  setEmployees,
}) {
  const { Option } = Select;
  const employeeSignUpInputs = [
    'employeeName',
    'employeeType',
    'phone',
    'password',
  ];

  const handleCreate = async (values) => {
    try {
      const { employeeName, employeeType, phone, password } = values;
      const response = await EmployeeServices.handleEmployeeSignUp({
        merchantId,
        employeeName,
        employeeType,
        phone,
        password,
      });
      if (response.data.success) {
        const tempEmployee = response.data.data;
        tempEmployee.isActive = 'Active';
        const newEmployees = [...employees];
        newEmployees.push(tempEmployee);
        setEmployees(newEmployees);
        handleCancel();
      } else {
        alert(response.data.data);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  console.log(employees);
  return (
    <Modal
      title='Employee Sign Up'
      visible={visibleCreate}
      onCancel={handleCancel}
      footer={null}
    >
      <Form onFinish={handleCreate} name='basic'>
        {employeeSignUpInputs &&
          employeeSignUpInputs.map((field, index) => {
            return (
              <Form.Item
                key={shortid.generate()}
                label={field}
                name={field}
                rules={[
                  {
                    required: true,
                    message: `Please input ${field}!`,
                  },
                ]}
              >
                {field === 'password' ? (
                  <Input.Password />
                ) : field === 'employeeType' ? (
                  <Select
                    style={{ width: 200 }}
                    placeholder='Select the position'
                  >
                    <Option value='Owner'>Owner</Option>
                    <Option value='Employee'>Employee</Option>
                  </Select>
                ) : (
                  <Input />
                )}
              </Form.Item>
            );
          })}
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            key='submit'
            className='login-form-button'
          >
            <p>Sign Up</p>
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
