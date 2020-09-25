import React from 'react';
import { Chart, Interval, Tooltip } from 'bizcharts';

export default function Charts({ visitData }) {
    console.log(visitData);
    return (
        <Chart height={200} data={visitData} autoFit interactions={['active-region']} padding="auto" >

            <Interval position="date*sales" />
            <Tooltip shared />
        </Chart>
    )
};