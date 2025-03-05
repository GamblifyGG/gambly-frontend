import { formatUnits } from "viem";

const ReferralListItem = ({ item }) => {
    return (
        <div className='p-2 text-xs grid-cols-5 grid justify-between border-b border-bordergray'>
            {/* <span className="truncate ...">{item.WalletAddress}</span> */}
            <span>{formatUnits(item.amount, item.casino.token.decimals)} {item.casino.token.symbol}</span>
            <span className="text-primary underline truncate">{item.casino.token.symbol}</span>
            <span>{item.amount}$</span>
            <span className='justify-self-end'>{new Date(item.created).toLocaleString()}</span>
        </div>
    );
}

export default ReferralListItem;