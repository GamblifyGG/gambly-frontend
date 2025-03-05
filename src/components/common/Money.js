import Icon from './Icon'
import { formatUnits } from 'viem'

export const { format: fmtUSD } = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
})

export function fmtNum(value, decimals = 8) {
  const fmt = Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  })

  return fmt.format(value)
}

const Money = ({ value, coin = { name: '', decimals: 8 }}) => {
  const num = fmtNum(value, coin.decimals)

  return (
    <div className="inline-flex items-center gap-2 uppercase">
      { coin.name && <Icon name={coin.name} size="0.9em"/> }
      <span>{num}</span>
      { coin.name && <span>{coin.name}</span> }
    </div>
  )
}

export const Units = ({ value, decimals, symbol }) => {
  const num = formatUnits(value, decimals)

  return (
    <div className="inline-flex items-center gap-2 uppercase">
      <span>{num}</span>
      { symbol && <span>{symbol}</span> }
    </div>
  )
}

export default Money