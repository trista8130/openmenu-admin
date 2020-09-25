import React, { useEffect, useRef } from 'react';
import './index.scss';
import shortid from 'shortid';

export default function PopUp(props) {
  // console.log(props);
  const {
    closePop,
    index,
    isCf,
    isFn,
    isPp,
    isSv,
    cfOrders,
    ppOrders,
    svOrders,
    fnOrders,
    handleDone,
  } = props;
  const pop = useRef();
  const handleClick = (e) => {
    if (pop.current.contains(e.target)) {
      return;
    }
    closePop();
  };
  useEffect(() => {
  
  }, [ppOrders,index]);
  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
 
  return (
    <div ref={pop} className='popup'>
      {props.cfOrders.length>0 && isCf && (
        <div>
          <h2>Order No. {cfOrders[index]._id}</h2>
          <p>Table {cfOrders[index].tableId}</p>
          {cfOrders[index].variantId &&
            cfOrders[index].variantId.map((m, i) => (
              <div key={shortid.generate()}>
                <div className='popup-detail'>
                  <div>
                    <p >Title: {m.title}</p>
                  </div>
                  <div>
                    <p>Amount: {m.amount}</p>
                  </div>
                  <div>
                    <p>Price:${m.price}</p>
                  </div>
                  <div>
                    {/* <input
                      onChange={(i) => handleDone(i)}
                      type='checkbox'
                      checked={isDone[i]}
                    /> */}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      {props.ppOrders.length > 0 && isPp && (
        <div>
          <h2>Order No. {ppOrders[index]._id}</h2>
          <p>Table {ppOrders[index].tableId}</p>
          {ppOrders[index].variantId &&
            ppOrders[index].variantId.map((m, i) => (
              <div key={shortid.generate()}>
                <div className='popup-detail'>
                  <div>
                    <p style={m.isDone?{ textDecoration: 'line-through' } : null}>Title: {m.title}</p>
                  </div>
                  <div>
                    <p>Amount: {m.amount}</p>
                  </div>
                  <div>
                    <p>Price:${m.price}</p>
                  </div>
                  <div>
                    <input
                      onChange={() => handleDone(i,index)}
                      type='checkbox'
                      checked={m.isDone}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      {props.svOrders.length > 0 && isSv && (
        <div>
          <h2>Order No. {svOrders[index]._id}</h2>
          <p>Table {svOrders[index].tableId}</p>
          {svOrders[index].variantId &&
            svOrders[index].variantId.map((m, i) => (
              <div key={shortid.generate()}>
                <div className='popup-detail'>
                  <div>
                    <p >Title: {m.title}</p>
                  </div>
                  <div>
                    <p>Amount: {m.amount}</p>
                  </div>
                  <div>
                    <p>Price:${m.price}</p>
                  </div>
                  <div>
                    {/* <input
                      onChange={(i) => handleDone(i)}
                      type='checkbox'
                      checked={isDone[i]}
                    /> */}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      {props.fnOrders.length > 0 && isFn && (
        <div>
          <h2>Order No. {fnOrders[index]._id}</h2>
          <p>Table {fnOrders[index].tableId}</p>
          {fnOrders[index].variantId &&
            fnOrders[index].variantId.map((m, i) => (
              <div key={shortid.generate()}>
                <div className='popup-detail'>
                  <div>
                    <p >Title: {m.title}</p>
                  </div>
                  <div>
                    <p>Amount: {m.amount}</p>
                  </div>
                  <div>
                    <p>Price:${m.price}</p>
                  </div>
                  <div>
                    {/* <input
                      onChange={(i) => handleDone(i)}
                      type='checkbox'
                      checked={isDone[i]}
                    /> */}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
