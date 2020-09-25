import React, { useState, useEffect } from 'react';
import SideBar from '../../components/SideBar';
import { Layout } from 'antd';
import OrderService from '../../service/order';
import './index.scss';
import io from 'socket.io-client';
import shortid from 'shortid';
import PopUp from '../../components/Popup';
export default function CurrentOrdersPage() {
  const { Content } = Layout;
  const merchant = '123';
  const socket = io('https://om.demo.bctc.io');
  const [status, setStatus] = useState('Confirming');
  const [isPopUp, setIsPopUp] = useState(false);

  useEffect(() => {
    socket.on('news', (data) => {
      // console.log(data);
      socket.emit('my other event', { status: status });
    });
    socket.on('orders', (data) => {
      // console.log(data);
    });
  }, [socket, status]);

  const [cfOrders, setCfOrders] = useState({ result: [], total: '' });
  const [ppOrders, setPpOrders] = useState({ result: [], total: '' });
  const [svOrders, setSvOrders] = useState({ result: [], total: '' });

  const [fnOrders, setFnOrders] = useState({ result: [], total: '' });
  const [popIndex, setPopIndex] = useState(0);
  const [isCf, setIsCf] = useState(false);
  const [isPp, setIsPp] = useState(false);
  const [isSv, setIsSv] = useState(false);
  const [isFn, setIsFn] = useState(false);
  const [checkOrder, setCheckOrder] = useState(false);

  const STATUS1 = 'Confirming';
  const STATUS2 = 'Preparing';
  const STATUS3 = 'Serving';
  const STATUS4 = 'Finished';

  useEffect(() => {
    const handleGetOrders = async () => {
      const confirmingOrders = await OrderService.handleGetTodayOrderStatusByMerchantId(
        merchant,
        STATUS1
      );
      if (confirmingOrders.data.success) {
        setCfOrders(confirmingOrders.data.data);
      }
      const preparingOrders = await OrderService.handleGetTodayOrderStatusByMerchantId(
        merchant,
        STATUS2
      );
      if (preparingOrders.data.success) {
        console.log(preparingOrders);

        setPpOrders(preparingOrders.data.data);
      }
      const servingOrders = await OrderService.handleGetTodayOrderStatusByMerchantId(
        merchant,
        STATUS3
      );
      if (servingOrders.data.success) {
        setSvOrders(servingOrders.data.data);
      }
      const finishedOrders = await OrderService.handleGetTodayOrderStatusByMerchantId(
        merchant,
        STATUS4
      );
      if (finishedOrders.data.success) {
        setFnOrders(finishedOrders.data.data);
      }
      if (
        confirmingOrders ||
        preparingOrders ||
        servingOrders ||
        finishedOrders
      ) {
        setCheckOrder(true);
      }
    };
    handleGetOrders();
    return;
  }, []);
  const handlePreparing = async (index, order) => {
    const temp = { status: STATUS2, order: order };
    setStatus(temp);
    const tempOrder = cfOrders.result.splice(index, 1);
    tempOrder[0].status = STATUS2;
    const newArr = { ...ppOrders };
    newArr.result.push(tempOrder[0]);
    setPpOrders(newArr);
    await OrderService.handleChangeOrderStatus(order, STATUS2);
  };
  const handleServing = async (index, order) => {
    const temp = { status: STATUS3, order: order };
    setStatus(temp);
    const tempOrder = ppOrders.result.splice(index, 1);
    console.log(tempOrder);
    tempOrder[0].status = STATUS3;

    const newArr = { ...svOrders };
    newArr.result.push(tempOrder[0]);
    setSvOrders(newArr);
    await OrderService.handleChangeOrderStatus(order, STATUS3);
  };
  const handleFinished = async (index, order) => {
    const temp = { status: STATUS4, order: order };
    setStatus(temp);
    console.log(index);
    const tempOrder = svOrders.result.splice(index, 1);
    console.log(tempOrder);
    tempOrder[0].status = STATUS4;

    const newArr = { ...fnOrders };
    newArr.result.push(tempOrder[0]);
    setFnOrders(newArr);
    await OrderService.handleChangeOrderStatus(order, STATUS4);
  };
  const handlePopup = (index, order) => {
    setIsPopUp(!isPopUp);
    setPopIndex(index);
    if (order === 'cfOrders') {
      setIsCf(true);
      setIsPp(false);
      setIsSv(false);
      setIsFn(false);
    } else if (order === 'ppOrders') {
      setIsCf(false);
      setIsPp(true);
      setIsSv(false);
      setIsFn(false);
    } else if (order === 'svOrders') {
      setIsCf(false);
      setIsPp(false);
      setIsSv(true);
      setIsFn(false);
    } else if (order === 'fnOrders') {
      setIsCf(false);
      setIsPp(false);
      setIsSv(false);
      setIsFn(true);
    } else {
    }
  };
  const closePop = () => {
    setIsPopUp(false);
  };
  const handleDone = (i, index) => {
    const temp = { ...ppOrders };
    temp.result[index].variantId[i].isDone = !temp.result[index].variantId[i]
      .isDone;
    setPpOrders(temp);
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar />
      <Content style={{ margin: '24px 16px 0' }}>
        <div className='current-orders-container'>
          {isPopUp && checkOrder && (
            <PopUp
              index={popIndex}
              cfOrders={cfOrders.result}
              ppOrders={ppOrders.result}
              svOrders={svOrders.result}
              fnOrders={fnOrders.result}
              isCf={isCf}
              isFn={isFn}
              isPp={isPp}
              isSv={isSv}
              closePop={closePop}
              handleDone={handleDone}
            />
          )}
          <div className='orders-box'>
            <h2>Confirming Orders</h2>
            <div className='order-status'>
              {cfOrders.result &&
                cfOrders.result.map((v, index) => (
                  <div className='order-warp' key={shortid.generate()}>
                    <div onClick={() => handlePopup(index, 'cfOrders')}>
                      <p>Order No.{v._id}</p>
                      <p>Table {v.tableId}</p>
                      <p>Type {v.type}</p>
                      {v.variantId &&
                        v.variantId.map((m) => (
                          <div key={shortid.generate()}>
                            <h2>{m.variant}</h2>
                          </div>
                        ))}
                      <p>{v.date}</p>
                      <p className='orders-status'> Status: {v.status}</p>
                    </div>

                    <button onClick={() => handlePreparing(index, v._id)}>
                      Preparing
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <div className='orders-box'>
            <h2>Preparing Orders</h2>
            <div className='order-status'>
              {ppOrders.result &&
                ppOrders.result.map((v, index) => (
                  <div className='order-warp' key={shortid.generate()}>
                    <div onClick={() => handlePopup(index, 'ppOrders')}>
                      <p>Order No.{v._id}</p>
                      <p>Table {v.tableId}</p>
                      <p>Type {v.type}</p>
                      {v.variantId &&
                        v.variantId.map((m) => (
                          <div key={shortid.generate()}>
                            <h2>{m.variant}</h2>
                          </div>
                        ))}
                      <p>{v.date}</p>
                      <p className='orders-status'> Status: {v.status}</p>
                    </div>
                    <button onClick={() => handleServing(index, v._id)}>
                      Serving
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <div className='orders-box'>
            <h2>Serving Orders</h2>
            <div className='order-status'>
              {svOrders.result &&
                svOrders.result.map((v, index) => (
                  <div className='order-warp' key={shortid.generate()}>
                    <div onClick={() => handlePopup(index, 'svOrders')}>
                      <p>Order No.{v._id}</p>
                      <p>Table {v.tableId}</p>
                      <p>Type {v.type}</p>
                      {v.variantId &&
                        v.variantId.map((m) => (
                          <div key={shortid.generate()}>
                            <h2>{m.variant}</h2>
                          </div>
                        ))}
                      <p>{v.date}</p>
                      <p className='orders-status'> Status: {v.status}</p>
                    </div>
                    <button onClick={() => handleFinished(index, v._id)}>
                      Finished
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <div className='orders-box'>
            <h2>Finished Orders</h2>
            <div className='order-status'>
              {fnOrders.result &&
                fnOrders.result.map((v, index) => (
                  <div
                    className='order-warp'
                    onClick={() => handlePopup(index, 'fnOrders')}
                    key={shortid.generate()}
                  >
                    <p>Order No.{v._id}</p>
                    <p>Table {v.tableId}</p>
                    <p>Type {v.type}</p>
                    {v.variantId &&
                      v.variantId.map((m) => (
                        <div key={shortid.generate()}>
                          <h2>{m.variant}</h2>
                        </div>
                      ))}
                    <p>{v.date}</p>
                    <p className='orders-status'>Status: {v.status}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
