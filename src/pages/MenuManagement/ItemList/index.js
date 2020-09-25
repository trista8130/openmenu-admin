import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Form,
  Tag,
  Checkbox,
  message,
  Popconfirm,
  Popover,
  Space,
} from 'antd';
import MenuServices from '../../../service/menu';
import UploadImageModal from '../UploadImageModal';
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import AddItemModal from '../AddItemModal';
import Highlighter from 'react-highlight-words';

export default function ItemList({
  merchantId,
  categoryUpdate,
  itemUpdate,
  setItemUpdate,
}) {
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [itemVisible, setItemVisible] = useState(false);
  const [modalIndex, setModalIndex] = useState(null);

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
  }, [merchantId, itemUpdate, categoryUpdate]);

  const data = [],
    filters = [];

  items &&
    items.map((v, i) => {
      if (i > 0 && items[i].title === items[i - 1].title) {
        return null;
      } else
        return filters.push({
          key: `filter${i}`,
          text: v.title,
          value: v.title,
        });
    });
  console.log(filters);
  items &&
    items.map((v, i) => {
      if (i > 0 && items[i].itemStringId === items[i - 1].itemStringId) {
        return null;
      } else
        return data.push({
          key: i,
          category: v.title,
          title: v.itemInfo.title,
          description: v.itemInfo.description,
          type: v.itemInfo.type,
          image: v.itemInfo.image ? (
            <Popover
              placement='left'
              content={
                <img
                  src={v.itemInfo.image}
                  alt={`itemPop${i}`}
                  style={{ width: '500px' }}
                />
              }
              trigger='click'
            >
              <img
                src={v.itemInfo.image}
                alt={`item${i}`}
                style={{ width: '50px' }}
              />
            </Popover>
          ) : (
            'No photo'
          ),
        });
    });

  const [formType] = Form.useForm();

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    typeKeys,
    typeValues,
    ...restProps
  }) => {
    // console.log(typeValues);
    let defaultValue = [];
    typeValues &&
      typeValues.map((v, i) => {
        if (v) {
          defaultValue.push(typeKeys[i]);
        }
        return defaultValue;
      });

    return (
      <td {...restProps}>
        {editing ? (
          dataIndex === 'type' ? (
            <Form form={formType} initialValues={{ type: defaultValue }}>
              <Form.Item name={dataIndex}>
                <Checkbox.Group options={typeKeys} />
              </Form.Item>
            </Form>
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
    const rowType = await formType.validateFields();
    const checkedType = rowType.type;
    const itemId = items[key].itemInfo._id;

    let type = {
      isVegan: false,
      isSpicy: false,
      isGlutenFree: false,
      isHalal: false,
    };

    checkedType &&
      checkedType.map((v) => {
        return (type = { ...type, [v]: true });
      });

    // console.log(type);
    const changeData = {
      itemId,
      title: row.title,
      description: row.description,
      type,
    };
    console.log(changeData);
    // checkedType = [];

    const response = await MenuServices.updateItemById(changeData);
    if (response.data.success) {
      message.success('Successfully updated item');
      setItemUpdate(!itemUpdate);
      setEditingKey('');
    }
  };

  const remove = async (key) => {
    const itemId = items[key].itemInfo._id;
    try {
      const response = await MenuServices.deleteItemByItemId(itemId);
      if (response.data.success) {
        message.success('Successfully deleted item');
      }
      setItemUpdate(!itemUpdate);
    } catch (e) {
      alert(e);
    }
  };

  const handleUpload = (i) => {
    // console.log(i);
    setVisible(true);
    setModalIndex(i);
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
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters,
      onFilter: (value, record) => record.category.indexOf(value) === 0,
      // console.log(value,record)
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      editable: true,
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      editable: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      editable: true,
      render: (record) => (
        <>
          {Object.entries(record).map((v, i) => {
            return (
              <div key={v[0]}>
                {v[1] ? (
                  <Tag icon={<CheckCircleOutlined />} color='success'>
                    {v[0]}
                  </Tag>
                ) : (
                  <Tag icon={<CloseCircleOutlined />} color='error'>
                    {v[0]}
                  </Tag>
                )}
              </div>
            );
          })}
        </>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
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
              onClick={() => handleUpload(record.key)}
            >
              Upload
            </Button>
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
        typeKeys: Object.keys(record.type),
        typeValues: Object.values(record.type),
      }),
    };
  });

  const handleShowItemModal = () => {
    setItemVisible(true);
  };

  return (
    <div>
      <Form form={form} component={false}>
        <Button
          type='primary'
          style={{ marginBottom: 16 }}
          onClick={handleShowItemModal}
        >
          Add a item
        </Button>
        {/* <Space style={{ marginBottom: 16 }}>
          <Button onClick={this.clearFilters}>Clear filters</Button> 
          <Button
            onClick={() => ({
              filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
              }) => handleReset(clearFilters),
            })}
          >
            Clear search
          </Button>
        </Space> */}
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
          // expandable={{
          //   expandedRowRender: (record) => (
          //     <p style={{ margin: 0 }}>{record.description}</p>
          //   ),
          //   rowExpandable: (record) => record.name !== 'Not Expandable',
          // }}
          dataSource={data}
        />
      </Form>
      <UploadImageModal
        items={items}
        visible={visible}
        setVisible={setVisible}
        modalIndex={modalIndex}
        itemUpdate={itemUpdate}
        setItemUpdate={setItemUpdate}
      />
      <AddItemModal
        merchantId={merchantId}
        itemVisible={itemVisible}
        setItemVisible={setItemVisible}
        itemUpdate={itemUpdate}
        setItemUpdate={setItemUpdate}
        categoryUpdate={categoryUpdate}
      />
    </div>
  );
}
//   return <EditableTable />;
// }
