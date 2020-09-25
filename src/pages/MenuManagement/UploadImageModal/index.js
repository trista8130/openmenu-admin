import React, { useState, useRef } from 'react';
import { Modal, Button, Input, message } from 'antd';
import FileService from '../../../service/file';
import MenuServices from '../../../service/menu';

export default function UploadImageModal({
  items,
  visible,
  setVisible,
  modalIndex,
  itemUpdate,
  setItemUpdate,
}) {
  const [loading, setLoading] = useState(false);
  const [recordingLink, setRecordingLink] = useState(null);

  const handleCreateLink = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('item', file[0]);
    try {
      const uploaded = await FileService.createItemImage(formData);
      if (uploaded.data.success) {
        setLoading(false);
        setRecordingLink(uploaded.data.data);
        message.info('Uploaded image is ready!');
      }
    } catch (e) {
      alert(e);
      setLoading(false);
    }
  };

  const handleOk = async () => {
    setLoading(true);
    const itemId = items[modalIndex].itemInfo._id;
    if (recordingLink === null) {
      message.info('No image has been chosen!');
    }
    try {
      const response = await MenuServices.uploadItemImageById(itemId, recordingLink);
      if (response.data.success) {
        setLoading(false);
        message.info('Uploaded successfully!');
        setVisible(false);
        setItemUpdate(!itemUpdate);
      } 
    } catch (e) {
      alert(e);
      setLoading(false);
    }
  };
  const inputRef = useRef();
  const handleCancel = () => {
    setVisible(false);
    setRecordingLink('');

    inputRef.current.state.value = null;
  };
  return (
    <Modal
      centered
      visible={visible}
      title='Upload Image'
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key='submit'
          type='primary'
          loading={loading}
          onClick={handleOk}
        >
          Submit
        </Button>,
      ]}
    >
      <Input
        type='file'
        onChange={(e) => handleCreateLink(e.target.files)}
        ref={inputRef}
      />
    </Modal>
  );
}
