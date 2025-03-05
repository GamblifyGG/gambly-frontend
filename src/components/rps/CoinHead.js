import { Icon } from '@/components/common'

const CoinHead = ({ side = 'heads', size="xs" }) => {
  const map = {
    heads: 'bg-gradient-to-b from-[#292B31] to-[#181921]',
    tails: 'bg-gradient-to-b from-secondary-600 to-secondary-500'
  }

  const variant = map[side] || map.heads

  const sizes = {
    xs: 'w-[1em] h-[1em]',
    lg: 'w-[80px] h-[80px]',
  }

  return (
    <div className={`${variant} rounded-full flex items-center justify-center ${sizes[size]} text-3xl`}>
      <Icon name="cube" />
    </div>
  )
}

export default CoinHead