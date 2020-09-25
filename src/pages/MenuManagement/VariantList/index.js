import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Form,
  message,
  InputNumber,
  Popconfirm,
  Space,
} from 'antd';
import MenuServices from '../../../service/menu';
import AddVariantModal from '../AddVariantModal';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

export default function VariantList({ merchantId, itemUpdate }) {
  const [variants, setVariants] = useState([]);
  const [variantUpdate, setVariantUpdate] = useState(false);
  const [variantVisible, setVariantVisible] = useState(false);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const response = await MenuServices.getVariantsByMerchantId(merchantId);
        console.log(response.data.data.result);
        setVariants(response.data.data.result);
      } catch (e) {
        alert(e);
      }
    };
    fetchVariants();
  }, [merchantId, variantUpdate, itemUpdate]);

  const data = [];
  variants &&
    variants.map((v, i) => {
      return data.push({
        key: i,
        item: v.itemInfo.title,
        title: v.title,
        description: v.description,
        price: v.price.$numberDecimal,
      });
    });

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          dataIndex === 'price' ? (
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
            >
              <InputNumber min={0} step={0.01} />
            </Form.Item>
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
      description: '',
      price: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (record) => {
    const key = record.key;
    const row = await form.validateFields();
    console.log(typeof row.price === 'number');
    if (typeof row.price === 'number') {
      row.price = row.price.toFixed(2);
    }
    const changeData = {
      variantId: variants[key]._id,
      title: row.title,
      description: row.description,
      price: row.price,
    };
    console.log(changeData);

    const response = await MenuServices.updateVariantById(changeData);
    if (response.data.success) {
      message.success('Successfully updated variant');
      console.log(response.data.data);
      setVariantUpdate(!variantUpdate);
      setEditingKey('');
    }
  };

  const remove = async (key) => {
    const variantId = variants[key]._id;
    try {
      const response = await MenuServices.deleteVariantByVariantId(variantId);
      if (response.data.success) {
        message.success('Successfully deleted variant');
      }
      setVariantUpdate(!variantUpdate);
    } catch (e) {
      alert(e);
    }
  };

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          // ref={(node) => {
          //   this.searchInput = node;
          // }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      // if (visible) {
      //   setTimeout(() => this.searchInput.select(), 100);
      // }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      ...getColumnSearchProps('item'),
    },
    { title: 'Title', dataIndex: 'title', key: 'title', editable: true },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      editable: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <p
              onClick={() => save(record)}
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
              // style={{ margin: '10px' }}
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
      }),
    };
  });

  const handleShowVariantModal = () => {
    setVariantVisible(true);
  };

  return (
    <div>
      <Form form={form} component={false}>
        <Button
          type='primary'
          style={{ marginBottom: 16 }}
          onClick={handleShowVariantModal}
        >
          Add a variant
        </Button>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergedColumns}
          rowClassName='editable-row'
          pagination={{
            onChange: cancel,
          }}
          dataSource={data}
        />
      </Form>

      <AddVariantModal
        merchantId={merchantId}
        variantVisible={variantVisible}
        setVariantVisible={setVariantVisible}
        variantUpdate={variantUpdate}
        setVariantUpdate={setVariantUpdate}
        itemUpdate={itemUpdate}
      />
    </div>
  );
}
//   return <EditableTable />;
// }
