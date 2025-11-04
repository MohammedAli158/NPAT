import { useContext, useState } from "react"
import { socket } from "../socket/Socket"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"

const RoomHome = () => {
  const [joinedArray, setJoinedArray] = useState<string[]>([])
  const [leftArray, setLeftArray] = useState<string[]>([])
  const [roundsFinish, setRoundsFinish] = useState<boolean>(false)
  const { roomName, userId, setRoundIds, roundIds } = useContext(UserContext)
  const nav = useNavigate()

  socket.on("Someone Joined", (data) => setJoinedArray([...joinedArray, data.Name]))
  socket.on("Left Room", (data) => setLeftArray([...leftArray, data.username]))

  const handleOnPlay = () => socket.emit("Create Round", { roomName, userId })

  socket.on("Force Create", (data) => {
    const roundId: string = data.roundId
    if (roundIds) setRoundIds([...roundIds, roundId])
    else setRoundIds([roundId])

    if (roundIds?.length === 5) setRoundsFinish(true)
    else nav("/round-page")

    socket.emit("Join Round", { roundId, userId, roomName })
  })

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#00BCD4] via-[#E57373] to-[#FFEB3B] text-gray-900">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-80 text-center space-y-4">
        <h2 className="text-2xl font-semibold">Room Home</h2>
        {joinedArray.map((t, i) => (
          <div key={i} className="text-green-700">{t} - Joined</div>
        ))}
        {leftArray.map((t, i) => (
          <div key={i} className="text-red-600">{t} - Left</div>
        ))}
        {roundsFinish && <h1 className="text-lg font-bold text-[#E57373]">Rounds FINISHED...</h1>}
        <button
          className="bg-[#FFEB3B] text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-yellow-400 transition"
          onClick={handleOnPlay}
        >
          Start Playing
        </button>
      </div>
    </div>
  )
}
export default RoomHome
