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
    BarChart,
    Bar,
    Area,
} from 'recharts';

const BetsChart = ({ data2, tokenSymbol }) => {
    const [data, setData] = React.useState(data2);
    const hasBets = data && data.length > 0 && data.some(item => item.volume > 0);
    
    // Sample data for when no bets have been placed
    const sampleData = [
        { name: 'Day 1', volume: 100 },
        { name: 'Day 2', volume: 200 },
        { name: 'Day 3', volume: 150 },
        { name: 'Day 4', volume: 300 },
        { name: 'Day 5', volume: 250 },
        { name: 'Day 6', volume: 400 },
        { name: 'Day 7', volume: 350 },
    ];
    
    // Use actual data if available, otherwise use sample data
    const displayData = hasBets ? data : sampleData;
    const maxValue = Math.max(...displayData.map(item => item.volume));

    useEffect(() => {
        console.log('data', data2);
        setData(data2)
    }, [data2])

    // render() {
    return (<div className=' h-full w-full flex flex-col flex-grow relative'>
        {/* <div>something</div> */}
        <span>🎲 ${tokenSymbol} Betting Volume</span>
        <span className='text-xs text-lightgray'>
            The Betting Volume is the total amount of ${tokenSymbol} that has been bet on the casino.<p></p>
        </span>
        <ResponsiveContainer width="100%" height="100%" className={'flex items-center justify-center'}>
            <div className='opacity-70 text-[60px] h-[100px] absolute z-50 flex items-center justify-center'>🎲</div>
            {!hasBets && (
                <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                    No bets have been placed yet
                </div>
            )}
            <AreaChart 
                style={{}}
                margin={{
                    top: 30, right: 30, left: 20, bottom: 5,
                }} 
                width={500} 
                className='bg-dark-700 rounded-md border border-[#20212D] mt-2' 
                height={'100%'} 
                data={displayData}
            >
                <XAxis 
                    tick={{
                        fontSize: 12,
                    }} 
                    className='text-[#20212D]' 
                    dataKey="name" 
                />
                <YAxis type="number" domain={['auto', maxValue]}/>
                <Tooltip wrapperClassName='!bg-[#20212D] !rounded-md !border-darkgray !border' />
                <Area 
                    type="monotone" 
                    dataKey="volume" 
                    fill={hasBets ? '#4CAF50' : '#4CAF5050'} 
                    name='🎲 Bets' 
                    stroke={hasBets ? '#4CAF50' : '#4CAF5050'} 
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>)
}

export default BetsChart;