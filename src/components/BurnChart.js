import React, { PureComponent, useEffect } from 'react';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';


const BurnChart = ({ data2, tokenSymbol }) => {
    const [data, setData] = React.useState(data2);
    const hasBurns = data && data.length > 0 && data.some(item => item.volume > 0);
    
    // Sample data for when no burns have occurred
    const sampleData = [
        { name: 'Day 1', volume: 50 },
        { name: 'Day 2', volume: 100 },
        { name: 'Day 3', volume: 75 },
        { name: 'Day 4', volume: 150 },
        { name: 'Day 5', volume: 125 },
        { name: 'Day 6', volume: 200 },
        { name: 'Day 7', volume: 175 },
    ];
    
    // Use actual data if available, otherwise use sample data
    const displayData = hasBurns ? data : sampleData;
    const maxValue = Math.max(...displayData.map(item => item.volume));

    useEffect(() => {
        console.log('[burn stats]', data2);
        setData(data2)
    }, [data2])

    // render() {
    return (<div className=' h-full w-full flex flex-col flex-grow relative'>
        {/* <div>something</div> */}
        <span>🔥 ${tokenSymbol} Burn Amount</span>
        <span className='text-xs text-lightgray'>
            The Burn Amount is the total amount of ${tokenSymbol} that will be burned.<p></p>
            {/* This is a deflationary mechanism that reduces the total supply of tokens, increasing the value of the remaining tokens, and increasing the betting volume for the casino. */}
        </span>
        <ResponsiveContainer width="100%" height="100%" className={'flex items-center justify-center'}>
            <div className='opacity-70 mt-10 text-[100px] h-[100px] absolute z-50 flex items-center justify-center'>🔥</div>
            {!hasBurns && (
                <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                    No tokens have been burned yet
                </div>
            )}
            <AreaChart style={{

            }} margin={{
                top: 30, right: 30, left: 20, bottom: 5,
            }} width={500} className='bg-dark-700 rounded-md border border-[#20212D] mt-2' height={'100%'} data={displayData}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis tick={{
                    fontSize: 12,
                    // fill: '#20212D'
                }} className='text-[#20212D]' dataKey="name" />
                <YAxis type="number" domain={['auto', maxValue]}/>
                {/* <CartesianGrid stroke="#20212D" /> */}
                <Tooltip wrapperClassName='!bg-[#20212D] !rounded-md !border-darkgray !border' />
                {/* <Legend /> */}
                {/* <Line type="monotone" dataKey="siteProfit" name='UT Investors' stroke="#ffa843" activeDot={{ r: 8 }} /> */}
                <Area 
                    type="monotone" 
                    dataKey="volume" 
                    unit={tokenSymbol} 
                    fill={hasBurns ? 'rgb(204 62 62)' : 'rgba(204, 62, 62, 0.3)'} 
                    name='🔥 Burn' 
                    stroke={hasBurns ? 'rgb(204 62 62)' : 'rgba(204, 62, 62, 0.3)'} 
                />
                {/* <Area type="monotone" dataKey="totalPayout" name='🚀 House' fill='#febe00' stroke="#febe00" /> */}
            </AreaChart>
        </ResponsiveContainer>
    </div>)
}

export default BurnChart;