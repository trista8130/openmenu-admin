import React, { useEffect, useState } from 'react';
import { Layout, Table, Space, Popconfirm, Button } from 'antd';
import SideBar from '../../components/SideBar';
import EmployeeServices from '../../service/employee';
import CreateModal from './employeeSignUp';
import UpdateModal from './employeeProfileUpdate';
import shortid from 'shortid';

export default function EmployeesManagementPage() {
  const { Content } = Layout;
  const { Column } = Table;

  const merchantId = '123';

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    try {
      const fetchEmployees = async () => {
        const response = await EmployeeServices.handleGetEmployeesByMerchantId({
          merchantId,
        });
        if (response.data.success) {
          const employeeArr = response.data.data.result.map((employee, i) => {
            employee.key = i;
            if (employee.isActive) {
              employee.isActive = 'Active';
            } else {
              employee.isActive = 'Inactive';
            }
            return employee;
          });
          setEmployees([...employeeArr]);
        } else {
          alert(response.data.data);
        }
      };
      fetchEmployees();
    } catch (error) {
      alert(error);
    }
  }, [merchantId]);

  const handleToggle = async (record, index) => {
    try {
      const { merchantId, _id } = record;
      const response = await EmployeeServices.handleToggleEmployeeActiveness({
        merchantId,
        employeeId: _id,
      });
      if (response.data.success) {
        const newEmployees = [...employees];
        newEmployees[index].isActive = response.data.data.isActive;
        if (newEmployees[index].isActive) {
          newEmployees[index].isActive = 'Active';
        } else {
          newEmployees[index].isActive = 'Inactive';
        }
        setEmployees(newEmployees);
      } else {
        alert(response.data.data);
      }
    } catch (error) {
      alert(error);
    }
  };

  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [employeeId, setEmployeeId] = useState('');

  const handleShowEditModal = (v) => {
    setVisibleEdit(true);
    setEmployeeId(v);
  };

  const handleShowCreateModal = () => {
    setVisibleCreate(true);
  };

  const handleCancel = () => {
    setVisibleEdit(false);
    setVisibleCreate(false);
  };

  const handleDelete = async (record, index) => {
    try {
      const { _id } = record;
      const response = await EmployeeServices.handleDeleteEmployee({
        employeeId: _id,
      });
      if (response.data.success) {
        const newEmployees = [...employees];
        newEmployees.splice(index, 1);
        setEmployees(newEmployees);
      } else {
        alert(response.data.data);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar />
      <Content style={{ margin: '24px 16px 0' }}>
        <div className='analytic-page'>
          <Space style={{ marginBottom: 16 }}>
            <Button onClick={handleShowCreateModal} type='primary'>
              Add an Employee
            </Button>
          </Space>

          <CreateModal
            handleCancel={handleCancel}
            visibleCreate={visibleCreate}
            setVisibleCreate={setVisibleCreate}
            merchantId={merchantId}
            employees={employees}
            setEmployees={setEmployees}
          />

          <UpdateModal
            visibleEdit={visibleEdit}
            handleCancel={handleCancel}
            employeeId={employeeId}
          />

          <Table dataSource={employees} rowKey={shortid.generate}>
            <Column title='Name' dataIndex='employeeName' key='employeeName' />
            <Column title='Type' dataIndex='employeeType' key='employeeType' />
            <Column
              title='Status'
              dataIndex='isActive'
              key='isActive'
              render={(text, record, index) => (
                <Space size='middle'>
                  <button onClick={() => handleToggle(record, index)}>
                    {text}
                  </button>
                </Space>
              )}
            />
            <Column
              title='Action'
              key='action'
              render={(text, record, index) => (
                <Space size='middle'>
                  <button onClick={() => handleShowEditModal(record._id)}>
                    Edit
                  </button>
                  <Popconfirm
                    title='Are you sure?'
                    onConfirm={() => handleDelete(record, index)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <button href='#'>Delete</button>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </div>
      </Content>
    </Layout>
  );
}
