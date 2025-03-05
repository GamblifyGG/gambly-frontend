import { useEffect, useState, useRef } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { formatUnits, parseUnits } from "viem";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

function getFormattedDecimals(value, decimals) {
    const formattedValue = formatUnits(value, decimals);
    const decimalIndex = formattedValue.indexOf('.');

    if (decimalIndex === -1) {
        return 0;
    }

    const numDecimals = formattedValue.length - decimalIndex - 1;
    return numDecimals;
}

// Infer step from displayed amount
function getStepUnit(value, decimals) {
    const d = Math.max(1, Math.round(decimals / 2))
    const u = (1 / Math.pow(10, d)).toFixed(d)
    return parseUnits(u, decimals)
}

const RaiseBetWindow = ({ playerCountdown, socket, windowType = 'raise', raiseAmountMin, raiseAmountMax, token, setRaiseWindowOpen }) => {
    const [raiseAmount, setRaiseAmount] = useState(raiseAmountMin.toNumber());
    const stepRef = useRef(getStepUnit(raiseAmountMax.toString(), token?.decimals))

    const raiseAction = async () => {
        try {
            let betAmount = raiseAmount

            if (raiseAmountMin.isEqualTo(raiseAmountMax)) {
                betAmount = raiseAmountMin;
            }
    
            console.log('poker:act', { action: windowType, bet: betAmount.toString()  })
            await socket.emitWithAck('poker:act', { action: windowType, bet: betAmount.toString()  })
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(()=> {
        console.log(token.decimals - raiseAmountMax.toString().length)
    }, [raiseAmount])

    return (

        <div className="w-full lg:w-[500px] h-full absolute bg-black bg-opacity-50 flex items-center justify-center">
            <div className="h-full w-full flex flex-col px-10 lg:px-4 lg:p-1 items-center gap-2">
                <div className="relative w-full h-[50px]">
                    {/* <label for="labels-range-input" className="sr-only">Labels range</label> */}
                    <RangeSlider
                        min={raiseAmountMin.toNumber()}
                        max={raiseAmountMax.toNumber()}
                        value={[raiseAmountMin.toNumber(), raiseAmount]}
                        id="range-slider-gradient"
                        className=""
                        step={stepRef.current}
                        rangeSlideDisabled={true}
                        thumbsDisabled={[true, false]}
                        onInput={(e) => {
                            setRaiseAmount(e[1]);
                        }}
                    >
                    </RangeSlider>
                    <div className="absolute lg:text-left items-center justify-center flex bottom-20 lg:-top-1 z-50 h-4 text-xs bg-secondary text-dark rounded-md px-2 left-0 right-0 lg:right-auto lg:left-[102%]">
                        <div className="absolute lg:flex hidden top-[3px] arrow-left -left-2 h-1 w-1 "></div>
                        {formatUnits(raiseAmount, token?.decimals)}
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        <div
                            onClick={() => {
                                setRaiseAmount(raiseAmountMin.toNumber());
                            }}
                            className="text-xs bg-gray text-white rounded-md  border border-bordergray p-1 text-gray-500 dark:text-gray-400 text-center flex items-center justify-center hover:opacity-75 cursor-pointer select-none">Min</div>
                        <div
                            onClick={() => {
                                setRaiseAmount(raiseAmountMin.plus(raiseAmountMax).div(2).toNumber());
                            }}
                            className="text-xs bg-gray text-white rounded-md  border border-bordergray p-1 text-gray-500 dark:text-gray-400 text-center flex items-center justify-center hover:opacity-75 cursor-pointer select-none">1/2</div>
                        <div
                            onClick={() => {
                                setRaiseAmount(raiseAmountMax.minus(raiseAmountMin).times(3).div(4).plus(raiseAmountMin).toNumber());
                            }}
                            className="text-xs bg-gray text-white rounded-md  border border-bordergray p-1 text-gray-500 dark:text-gray-400 text-center flex items-center justify-center hover:opacity-75 cursor-pointer select-none ">3/4</div>
                        <div
                            onClick={() => {
                                setRaiseAmount(raiseAmountMax.toNumber());
                            }}
                            className="text-xs bg-gray text-white rounded-md  border border-bordergray p-1 text-gray-500 dark:text-gray-400 text-center flex items-center justify-center hover:opacity-75 cursor-pointer select-none">All-in</div>
                    </div>
                </div>
                <div className="flex gap-2 mt-2">
                    <div onClick={() => {
                        setRaiseWindowOpen(false);
                    }} className="bg-red cursor-pointer hover:opacity-70 w-[200px] h-8 p-2 items-center justify-center flex rounded-md ">
                        Cancel
                    </div>
                    <div onClick={() => {
                        raiseAction();
                        setRaiseWindowOpen(false);
                    }} className="bg-green/60 overflow-hidden relative gap-1 dark text-dark cursor-pointer hover:opacity-70 w-[200px] h-8 p-2 items-center justify-center flex rounded-md ">
                        <div style={{width: `${playerCountdown/15 * 100}%`}} className="transition-all ease-linear duration-[1.1s] absolute w-full h-full bg-green left-0 bottom-0"></div>
                        <span className="relative">{windowType === 'raise' ? 'Raise' : 'Bet'}...{playerCountdown}s</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RaiseBetWindow;