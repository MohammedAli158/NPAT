import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import { socket } from "../socket/Socket"
import { useNavigate } from "react-router-dom"

const RoomStart = () => {
  const nav = useNavigate()
  const { roomName, setRoomName, userId } = useContext(UserContext)

  const handleEnterClick = async () => {
    socket.emit("Join Room", { userId, roomName })
    nav("/room-home")
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#FFEB3B] via-[#00BCD4] to-[#E57373] text-gray-800">
      <div className="bg-white/80 p-8 rounded-2xl shadow-lg flex flex-col gap-4">
        <input
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Create or Join Room"
          className="border-2 border-[#E57373] rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-[#00BCD4]"
        />
        <button
          onClick={handleEnterClick}
          className="bg-[#E57373] hover:bg-[#d32f2f] text-white py-2 px-6 rounded-lg transition"
        >
          Enter
        </button>
      </div>
    </div>
  )
}

export default RoomStart
