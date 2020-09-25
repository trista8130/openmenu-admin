import React from 'react';
import { Layout, Tabs } from 'antd';
import SideBar from '../../components/SideBar';
import './index.scss';
import {
  Chart,
  Interval,
  Tooltip,
  Coordinate,
  Interaction,
  Axis,
} from 'bizcharts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dataProcess from '../../helpers/cleanData';
import getAPIUrl from '../../constants/apiUrl';


const { TabPane } = Tabs;
const { Content } = Layout;

const URL = getAPIUrl();


export default function AnalyticsPage() {

  const [weeklyOrder, setweeklyOrder] = useState([]);
  const [monthlyOrder, setMonthlyOrder] = useState([]);
  const [ninetyDaysOrder, setNinetyDaysOrder] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [ninetyData, setNinetyData] = useState([]);
  const [category, setCategory] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [weeklySales, setweeklySales] = useState([]);
  const [weeklySalesData, setweeklySalesData] = useState([]);
  useEffect(() => {
    const handleGetDataSevenDays = async () => {
      try {
        const data = await axios.get(`${URL}/orders/merchant/date`, {
          params: {
            merchantId: '123',
            dateRange: 'weeks',
            rangeAmount: '1',
          },
        });
        if (data.data.success) {
          setweeklyOrder(data.data.data.result);
        }
      } catch (e) {
        alert(e.message);
      }
    };
    const handleGetDataThirtyDays = async () => {
      try {
        const data = await axios.get(`${URL}/orders/merchant/date`, {
          params: { merchantId: '123', dateRange: 'months', rangeAmount: '1' },
        });
        if (data.data.success) {
          setMonthlyOrder(data.data.data.result);
        }
      } catch (e) {
        alert(e.message);
      }
    };
    const handleGetDataNightyDays = async () => {
      try {
        const data = await axios.get(`${URL}/orders/merchant/date`, {
          params: { merchantId: '123', dateRange: 'days', rangeAmount: '90' },
        });
        if (data.data.success) {
          setNinetyDaysOrder(data.data.data.result);
        }
      } catch (e) {
        alert(e.message);
      }
    };

    const handleGetWeeklySalesData = async () => {
      try {
        const data = await axios.get(`${URL}/payments/date`, {
          params: {
            merchantId: '123',
            page: '1',
            rangeAmount: '30',
            dateRange: 'days',
          },
        });
        if (data.data.success) {
          setweeklySales(data.data.data);
        }
      } catch (e) {
        alert(e.message);
      }
    };

    const getPieChartInfo = async () => {
      try {
        const data = await axios.get(`${URL}/orders/merchant/date/statistics`, {
          params: { merchantId: '123', dateRange: 'days', rangeAmount: '90' },
        });
        if (data.data.success) {
          setCategory(data.data.data.result);
        }
      } catch (e) {
        alert(e.message);
      }
    };

    handleGetDataSevenDays();
    handleGetDataThirtyDays();
    handleGetDataNightyDays();
    handleGetWeeklySalesData();
    getPieChartInfo();
  }, []);


  useEffect(() => {
    const handleData = async () => {
      const weeklyProcessed = dataProcess.cleanData(weeklyOrder);
      const monthlyProcessed = dataProcess.cleanData(monthlyOrder);
      const ninetyDaysProcessed = dataProcess.cleanData(ninetyDaysOrder);
      console.log(weeklySales, 'weeklysales');
      const weeklySalesProcessed = dataProcess.cleanSalesData(weeklySales);
      const pieDataProcessed = dataProcess.cleanCategory(category);
      setWeeklyData([...weeklyProcessed]);
      setMonthlyData([...monthlyProcessed]);
      setNinetyData([...ninetyDaysProcessed]);
      setweeklySalesData([...weeklySalesProcessed]);
      setPieData([...pieDataProcessed]);
    };
    handleData();
  }, [weeklyOrder, monthlyOrder, ninetyDaysOrder, weeklySales, category]);

  return (
    <Layout>
      <SideBar />
      <Content style={{ margin: '24px 16px 0' }}>
        <div className='analytic_page'>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Weekly Order" key="1">
              <Chart height={200} data={weeklyData} autoFit interactions={['active-region']} padding="auto" >
                <Interval position="date*sales" />
                <Tooltip shared title="Weekly Order" />
              </Chart>
            </TabPane>
            <TabPane tab="Monthly Order" key="2">
              <Chart height={200} data={monthlyData} autoFit interactions={['active-region']} padding="auto" >
                <Interval position="date*sales" />
                <Tooltip shared title="Monthly Order" />
              </Chart>
            </TabPane>
            <TabPane tab="Ninety Days Order" key="3">
              <Chart height={200} data={ninetyData} autoFit interactions={['active-region']} padding="auto" >
                <Interval position="date*sales" />
                <Tooltip shared title="Ninety Days Order" />
              </Chart>
            </TabPane>
          </Tabs>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Weekly Sales" key="1">
              <Chart height={200} data={weeklySalesData} autoFit interactions={['active-region']} padding="auto" >
                <Interval position="date*sales" />
                <Tooltip shared title="Weekly Sales" />
              </Chart>
              Content of tab1
            </TabPane>
            <TabPane tab="Monthly Sales" key="2">
              Content of tab2
          </TabPane>
          </Tabs>
          <Chart height={400} data={pieData} autoFit>
            <Coordinate type='theta' radius={0.75} />
            <Tooltip showTitle={false} />
            <Axis visible={false} />
            <Interval
              position='percent'
              adjust='stack'
              color='item'
              style={{
                lineWidth: 1,
                stroke: '#fff',
              }}
              label={[
                'count',
                {
                  content: (data) => {
                    return `${data.item}: ${data.percent * 100}%`;
                  },
                },
              ]}
            />
            <Interaction type='element-single-selected' />
          </Chart>
        </div>
      </Content>
    </Layout>
  );
}
