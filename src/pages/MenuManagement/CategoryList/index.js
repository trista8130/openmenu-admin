import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Input,
  Form,
  Button,
  TimePicker,
  Tag,
  message,
  Space,
  Popconfirm,
} from 'antd';

import MenuServices from '../../../service/menu';
import AddCategoryModal from '../AddCategoryModal';
import moment from 'moment';

export default function CategoryList({
  merchantId,
  categoryUpdate,
  setCategoryUpdate,
}) {
  const [categories, setCategories] = useState([]);

  const defaultTimes = [null, null, null, null, null, null, null];
  const [times, setTimes] = useState(['All Day']);
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const [newTimes, setNewTimes] = useState();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await MenuServices.handleGetCategoryByMerchantId(
          merchantId
        );
        console.log(response.data.data.result);
        setCategories(response.data.data.result);
      } catch (e) {
        alert(e);
      }
    };
    fetchCategories();
  }, [merchantId, categoryUpdate]);

  const originData = [];

  categories &&
    categories.map((v, i) => {
      return originData.push({
        key: i.toString(),
        title: v.categoryInfo.title,
        avaliableTime: v.categoryInfo.avaliableTime,
        description: v.categoryInfo.description,
      });
    });

  const { RangePicker } = TimePicker;
  const format = 'HH:mm';

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    times,
    children,
    ...restProps
  }) => {
    const [formTime] = Form.useForm();
    const formRef = useRef(null);
    let formatTime = [];
    times &&
      times.length > 1 &&
      times.map((v) => {
        if (v) {
          let timeArr = v.split('-');
          formatTime.push([
            moment(timeArr[0], format),
            moment(timeArr[1], format),
          ]);
        }
        return formatTime;
      });

    useEffect(() => {
      if (formRef.current) {
        formTime.setFieldsValue({
          avaliableTime: formatTime,
        });
      }
      // eslint-disable-next-line
    }, []);

    return (
      <td {...restProps}>
        {editing ? (
          dataIndex === 'avaliableTime' ? (
            times.length === 1 ? (
              <Input disabled defaultValue='All Day' />
            ) : (
              <Form form={formTime} ref={formRef}>
                <Form.List name={dataIndex}>
                  {(fields) => (
                    <div>
                      {fields.map((field, i) => (
                        // console.log(fields)
                        <Space key={field.key}>
                          <span>{days[i]}</span>
                          <Form.Item
                            {...field}
                            name={[field.name]}
                            fieldKey={[field.fieldKey]}
                          >
                            <RangePicker
                              onChange={(dates, dateStrings) =>
                                handleTimeChange(dateStrings, i)
                              }
                              format={format}
                            />
                          </Form.Item>
                        </Space>
                      ))}
                    </div>
                  )}
                </Form.List>{' '}
              </Form>
            )
          ) : (
            <Form.Item
              name={dataIndex}
              style={{
                margin: 0,
              }}
              rules={[
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ]}
              // onChange={handleEditChange}
            >
              <Input />
            </Form.Item>
          )
        ) : (
          children
        )}
      </td>
    );
  };

  // const EditableTable = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      title: '',
      // avaliableTime: [
      //   { time: [moment('11:00', format), moment('11:00', format)] },
      //   { time: [moment('11:00', format), moment('11:00', format)] },
      //   { time: [moment('11:00', format), moment('11:00', format)] },
      //   { time: [moment('11:00', format), moment('11:00', format)] },
      //   { time: [moment('11:00', format), moment('11:00', format)] },
      // ],
      description: '',
      ...record,
    });
    setEditingKey(record.key);
    setNewTimes(originData[record.key].avaliableTime);
  };

  let changeTime;
  if (newTimes) {
    changeTime = [...newTimes];
  }
  const handleTimeChange = (dateStrings, i) => {
    changeTime[i] = dateStrings.join('-');
  };

  // const handleEditChange = (e) => {
  //   console.log(e.target.value)
  // }

  const cancel = () => {
    setEditingKey('');
    //warning,remove set
  };

  const save = async (key) => {
    const row = await form.validateFields();

    const categoryId = categories[key].categoryInfo._id;
    console.log(changeTime);
    const changeData = {
      _id: categoryId,
      merchantId: merchantId,
      title: row.title,
      description: row.description,
      avaliableTime: changeTime,
    };
    console.log(changeData);

    const response = await MenuServices.UpsertCategoryByCategoryId(changeData);
    if (response.data.success) {
      message.success('Successfully updated category');
      setCategoryUpdate(!categoryUpdate);
      // setTimes(['All Day']);
      setEditingKey('');
    }
  };

  const remove = async (key) => {
    // setCategoryUpdate(false);
    const categoryId = categories[key].categoryInfo._id;
    try {
      const response = await MenuServices.DeleteCategoryByCategoryId(
        categoryId
      );
      if (response.data.success) {
        message.success('Successfully deleted category');
        setCategoryUpdate(!categoryUpdate);
      }
    } catch (e) {
      alert(e);
    }
  };

  const [visible, setVisible] = useState(false);
  const handleshowModal = () => {
    setVisible(true);
  };
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      width: '20%',
      editable: true,
    },
    {
      title: 'AvaliableTime',
      dataIndex: 'avaliableTime',
      width: '40%',
      editable: true,
      render: (record) => (
        <>
          {record.map((v, i) => {
            return (
              <div key={days[i]}>
                {record.length > 1 && v && <span>{days[i]}</span>}
                {v && <Tag key={`time ${i + 1}`}>{v}</Tag>}
              </div>
            );
          })}
        </>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '40%',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <p
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </p>
            <p onClick={cancel}>Cancel</p>
          </span>
        ) : (
          <span>
            <Button
              type='link'
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              style={{ margin: '10px' }}
            >
              Edit
            </Button>
            <Popconfirm
              title='Sure to delete?'
              onConfirm={() => remove(record.key)}
            >
              <Button type='link' disabled={editingKey !== ''}>
                Delete
              </Button>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        times: record.avaliableTime,
        index: Number(record.key),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Button
        type='primary'
        style={{ marginBottom: 16 }}
        onClick={() => handleshowModal()}
      >
        Add a category
      </Button>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={originData}
        columns={mergedColumns}
        rowClassName='editable-row'
        pagination={{
          onChange: cancel,
        }}
      />
      <AddCategoryModal
        visible={visible}
        setVisible={setVisible}
        days={days}
        times={times}
        setTimes={setTimes}
        defaultTimes={defaultTimes}
        format={format}
        RangePicker={RangePicker}
        merchantId={merchantId}
        categoryUpdate={categoryUpdate}
        setCategoryUpdate={setCategoryUpdate}
      />
    </Form>
  );
}
//   return <EditableTable />;
// }
