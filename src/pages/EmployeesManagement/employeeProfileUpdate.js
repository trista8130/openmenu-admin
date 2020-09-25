import React from 'react';
// import { useContext } from 'react';
import { Form, Input, Modal, Button } from 'antd';
import shortid from 'shortid';

import EmployeeServices from '../../service/employee';

export default function UpdateModal({ handleCancel, visibleEdit, employeeId }) {
  const employeeUpdateProfileInputs = ['employeeName', 'employeeType', 'phone'];
  const handleEdit = async (v) => {
    try {
      const value = Object.entries(v);
      console.log(value[0][1], value[1][1], value[2][1]);
      const response = await EmployeeServices.handleUpdateEmployeeProfile({
        employeeId,
        employeeName: value[0][1],
        employeeType: value[1][1],
        phone: value[2][1]
      });
      if (response.data.success) {
        alert('Update successfully!');
      } else {
        console.log(response.data.data);
        alert(response.data.data);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };
  return (
    <Modal
      title='Edit Employee'
      visible={visibleEdit}
      onCancel={handleCancel}
      footer={null}
    >
      <Form onFinish={handleEdit}>{
        employeeUpdateProfileInputs && employeeUpdateProfileInputs.map((field) => {
          return (
            <Form.Item label={field} name={field} key={shortid.generate()}>
              <Input />
            </Form.Item>
          )
        })
      }
        <Button
          type='primary'
          htmlType='submit'
          key='submit'
          className='login-form-button'
        >
          <p>Update</p>
        </Button>
      </Form>
    </Modal>
  );
}
