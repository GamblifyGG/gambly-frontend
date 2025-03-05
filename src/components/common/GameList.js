import Link from "next/link"

const Box = ({ href, name, imgSrc, enabled = true, className }) => {
    const classList = `relative h-40 gap-2 flex items-center justify-center border border-bordergray rounded-xl flex-col-reverse font-extrabold hover:bg-darkgray ${className} ${enabled ? 'cursor-pointer' : 'cursor-not-allowed'}`
    return (
        enabled ? (
            <Link
                href={href}
                className={classList}
            >
                <span className="text-center lg:text-base text-xs">{name}</span>
                <img src={imgSrc} alt={name} className="h-10 w-10 lg:h-20 lg:w-20" />
            </Link>
        ) : (
            <div
                href={href}
                className={classList}
            >
                <span className="text-center lg:text-base text-xs">{name}</span>
                <img src={imgSrc} alt={name} className="h-10 w-10 lg:h-20 lg:w-20" />
                <div className="absolute flex w-full h-full items-center justify-center backdrop-blur-[1px] rounded-2xl">
                    <div className="bg-dark auto border border-bordergray rounded-md -rotate-12 text-xl flex items-center justify-center p-2">
                        Coming Soon
                    </div>
                </div>
            </div>
        )
    )
}

const GameList2 = ({ tokenAddress, network }) => {
    return (
        <div className="grid grid-cols-3 gap-4">
            <Box
                href={`/casinos/${network}/${tokenAddress}/poker`}
                imgSrc="/icons/cards.svg"
                name="Poker"
            // enabled={true}
            />
            <Box
                href={`/casinos/${network}/${tokenAddress}/coinflip`}
                imgSrc="/icons/coin.svg"
                name="Coinflip"
            />

            <Box
                href={`/casinos/${network}/${tokenAddress}/rockpaperscissors`}
                imgSrc="/icons/rps.svg"
                name="Rock Paper Scissors"
            />


        </div>
    );
}

export default GameList2;
