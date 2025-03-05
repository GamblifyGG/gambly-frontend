import React, { useState, useEffect } from 'react';
import { formatUnits } from "viem"
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';

import { getCasinoBurnsVolume } from '@/api'

const dateFormatter = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short" });

function getAllDaysBetween(start, end) {
  const days = [];
  const current = new Date(start);

  while (current <= end) {
    days.push(dateFormatter.format(current)); 
    current.setDate(current.getDate() + 1);
  }

  return days;
}

const toBetStats = (intervals, decimals) => {
    if (!intervals.length) return []

    // const startDate = new Date(intervals[0].interval_start)
    // const endDate = new Date(intervals.at(-1).interval_start)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 7)
    const days = getAllDaysBetween(startDate, endDate).map(name => ({ name, volume: 0 }))

    const data = intervals.map(({ interval_start, interval_end, total }) => {
      const d = new Date(interval_start)
      const volume = formatUnits(total, decimals)
      return {
        name: dateFormatter.format(d),
        volume,
      }
    })

    return days.map(({ name, volume }) => {
      const match = data.find(x => x.name === name)
      if (match) return match
      return { name, volume}
    })
    
}

const BurnChart2 = ({ token, className }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [maxValue, setMaxValue] = useState()
  const window_duration = 864000
  const interval = 86400

  const fetchStats = async () => {
    setLoading(true)
    const [er, rawData] = await getCasinoBurnsVolume({ 
      chain_id: token?.network?.id,
      token_address: token?.address,
      window_duration,
      interval
    })
    setLoading(false)

    if (rawData) {
      const stats = toBetStats(rawData?.intervals, token?.decimals)
      const max = Math.max(...stats.map(item => item.volume))
      setData(stats)
      setMaxValue(max)
      console.log(stats, max)
    }
  }

  useEffect(() => {
    if (token) fetchStats()
  }, [token])

    // render() {
    return (<div className={`relative ${className}`}>
        <h4 className="font-semibold text-lg">🔥 ${token?.symbol} Burns</h4>
        <p className='text-sm text-lightgray mb-4'>
          The Burn Amount is the total amount of ${token?.symbol} that will be burned.
        </p>

        <div class="pt-[60%] w-full relative">
          <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
            { loading && <div className='animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary'></div>}
          { !loading && <ResponsiveContainer width="100%" height="100%" className={'flex items-center justify-center'}>
            <div className='opacity-70 text-[100px] h-[100px] absolute z-50 flex items-center justify-center'>🔥</div>
            <AreaChart style={{

            }} margin={{
                top: 30, right: 30, left: 20, bottom: 5,
            }} width={500} className='bg-dark-700 rounded-md border border-[#20212D] mt-2' height={'100%'} data={data}>
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
                <Area type="monotone" dataKey="volume" unit={token?.symbol} fill='rgb(204 62 62)' name='🔥 Burn' stroke="rgb(204 62 62)" />
                {/* <Area type="monotone" dataKey="totalPayout" name='🚀 House' fill='#febe00' stroke="#febe00" /> */}
            </AreaChart>
        </ResponsiveContainer>
        }
          </div>
        </div>

    </div>)

}

export default BurnChart2;