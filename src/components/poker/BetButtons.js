import 'react-range-slider-input/dist/style.css';
import RaiseBetWindow from "./buttons/RaiseBetWindow";
import CallButton from "./buttons/CallButton";
import CheckButton from "./buttons/CheckButton";
import FoldButton from "./buttons/FoldButton";
import BetButton from "./buttons/BetButton";

// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';
const BetButtons = ({ playerCountdown, user, token, socket, currentPlayer, validActions, betWindowOpen, setBetWindowOpen, betAmount, setBetAmount, betAmountMin, betAmountMax, raiseWindowOpen, setRaiseWindowOpen, raiseAmount, setRaiseAmount, raiseAmountMin, raiseAmountMax }) => {


    const isCurrentPlayer = user ? user.wallet_address === currentPlayer : false
    // console.log('[BET BUTTONS]', {currentPlayer, validActions}, isCurrentPlayer)

    return (<div className=' flex-grow items-center justify-end gap-4 px-10 flex h-full'>
        {/* {userSettings && String(userSettings.walletAddress).toLowerCase() === String(currentPlayer).toLowerCase() && */}
        <div className="flex flex-col justify-end gap-2 h-full w-full p-2 flex-grow">
            <div className="flex relative  gap-2 justify-center items-center h-full flex-grow">

                {betWindowOpen === true || raiseWindowOpen === true ?

                    <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                        {raiseWindowOpen === true &&
                            <RaiseBetWindow playerCountdown={playerCountdown} validActions={validActions} socket={socket} token={token} raiseAmountMax={raiseAmountMax} raiseAmountMin={raiseAmountMin} setRaiseWindowOpen={setRaiseWindowOpen} windowType={validActions.includes('raise') ? 'raise' : 'bet'}></RaiseBetWindow>
                        }
                    </div>
                    :
                    <>
                        {/* {validActions && validActions.includes('check') ? */}
                        {/* <CheckButton currentPlayer={currentPlayer} hidden={false} socket={socket}></CheckButton> */}
                        {/* : */}
                        <CheckButton isCurrentPlayer={isCurrentPlayer} socket={socket} validActions={validActions} currentPlayer={currentPlayer} hidden={true}></CheckButton>
                        {/* } */}
                        {/* {validActions && validActions.includes('call') && */}
                        <CallButton isCurrentPlayer={isCurrentPlayer} validActions={validActions} currentPlayer={currentPlayer} socket={socket} raiseAmountMin={raiseAmountMin} raiseAmountMax={raiseAmountMax} ></CallButton>
                        {/* } */}
                        {validActions && validActions.includes('bet') && raiseAmountMin !== raiseAmountMax &&
                            <BetButton isCurrentPlayer={isCurrentPlayer} validActions={validActions} currentPlayer={currentPlayer} type={'bet'} token={token} socket={socket} raiseAmountMin={raiseAmountMin} raiseAmountMax={raiseAmountMax} setRaiseAmount={setRaiseAmount} setRaiseWindowOpen={setRaiseWindowOpen} raiseWindowOpen={raiseWindowOpen}></BetButton>
                        }
                        {validActions && validActions.includes('raise') &&
                            <BetButton isCurrentPlayer={isCurrentPlayer} validActions={validActions} currentPlayer={currentPlayer} type={'raise'} token={token} socket={socket} raiseAmountMin={raiseAmountMin} raiseAmountMax={raiseAmountMax} setRaiseAmount={setRaiseAmount} setRaiseWindowOpen={setRaiseWindowOpen} raiseWindowOpen={raiseWindowOpen}></BetButton>
                        }
                        {validActions && !validActions.includes('raise') && !validActions.includes('bet') &&
                            <div className="bg-green flex-col dark text-dark cursor-not-allowed opacity-20 w-1/3 lg:w-[200px] h-14 p-2 items-center justify-center flex rounded-xl">
                                RAISE/BET
                            </div>
                        }

                        {/* {validActions && validActions.includes('fold') && */}
                        <FoldButton validActions={validActions} isCurrentPlayer={isCurrentPlayer} currentPlayer={currentPlayer} socket={socket}></FoldButton>
                        {/* } */}
                    </>
                }
            </div>
        </div >
        {/* } */}
    </div >);
}

export default BetButtons;