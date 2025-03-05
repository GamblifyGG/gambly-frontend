import { Money } from '@/components/common'
import { Button } from '@/components/form'
import io from 'socket.io-client'
import { RockPaperScissorsContext } from "@/context/RockPaperScissorsContext"
import { useEffect, useState, useContext } from "react"
import JoinGameModal from './JoinGameModal'
import authTokens from "@/utils/authTokens"
import GameResult from "./GameResult"
import RpsHead from './RpsHead'

const Table = () => {
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [socket, setSocket] = useState(null);
  const [game, setGame] = useState(null)
  const [doneGame, setDoneGame] = useState(null)
  const { games, fetchGames, removeGame, updateGame, addGame } = useContext(RockPaperScissorsContext)
  const walletAddress = null
  const join = (v) => {
    setGame(v)
    setShowModal(true)
  }

  const gameResult = (v) => {
    setDoneGame(v)
    setShowResultModal(true)
  }

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/pvp/rock-paper-scissors`

    const newSocket = io(url, {
      query: authTokens()
    });

    newSocket.on('game_update', (data) => {
      if (data.type !== "rock-paper-scissors") return

      console.log("[RPS UPDT]", data.state, data)

      if (data.state === "ended") {
        gameResult(data)
        removeGame(data.id)
      } else if (["starting", "waiting"].includes(data.state)) {
        addGame(data)
      } else {
        updateGame(data)
      }
    })

    setSocket(newSocket);

    return () => {
      newSocket.close();
      newSocket.disconnect();
    }
  }, [addGame, removeGame, updateGame]);

  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  return (
    <>
    <div className="data-table-cont">
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Game ID</th>
              <th>Stake</th>
              <th>Player One</th>
              <th>Status</th>
              <th>Player Two</th>
              <th>Verify</th>
              <th>Privacy</th>
            </tr>
          </thead>
          <tbody>
            {
              games.map(x => (
                <tr key={x.id}>
                  <td>
                      <div className="truncate max-w-[160px]">
                        <span>{x.id}</span>
                      </div>
                  </td>
                  <td><Money value={x.amount} decimals={x.token.decimals} name=""/></td>
                  <td>
                    <div className="flex gap-2 items-center">
                      <img className="rounded-full" src={`https://i.pravatar.cc/36?img=${x.players[0].user.id}`} alt=""/>
                      <span>player 1</span>
                    </div>
                   
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      { x.players[0].bet && <RpsHead side={x.players[0].bet} title={x.players[0].bet} /> }

                      { x.state == 'ended' && <Button variant="secondary" size="sm">{x.outcome}</Button> }
                      { x.state == 'waiting' && x.players[0].user.address != walletAddress && <Button size="sm" onClick={() => join(x)}>Join</Button> }
                      { x.state == 'waiting' && x.players[0].user.address == walletAddress && <Button size="sm" variant="dark">You Joined</Button> }
                      { x.state == 'ending' && <Button size="sm" variant="dark">Ending...</Button> }

                      { x.players.length == 2 && x.players[1].bet && <RpsHead side={x.players[1].bet} title={x.players[1].bet} /> }
                    </div>
     
                  </td>
                  <td>
                    {
                      x.players.length == 2 &&
                      <div className="flex gap-2 items-center">
                        <img className="rounded-full" src={`https://i.pravatar.cc/36?img=${x.players[1].user.id}`} alt=""/>
                        <span>player 2</span>
                      </div>
                    }
                    {
                      x.players.length == 1 && <span className="opacity-50">TBD</span>
                    }
                  </td>
                  <td>
                    <div className="flex">
                      <div className="truncate" style={{flex: '0 0 160px', maxWidth: '160px'}}>
                        <span>{x.id}</span>
                      </div>
                      <div className="opacity-30">
                        <iconify-icon icon="tabler:external-link"></iconify-icon>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span>{x.privacy}</span>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-5">
        <Button variant="clear"><iconify-icon icon="bx:caret-left"></iconify-icon>previous</Button>
        <Button variant="clear" disabled>next<iconify-icon icon="bx:caret-right"></iconify-icon></Button>
      </div>
    </div>
    <JoinGameModal showModal={showModal} setShowModal={setShowModal} game={game}/>
    <GameResult game={doneGame} showModal={showResultModal} setShowModal={setShowResultModal} />
    </>
  )
}

export default Table