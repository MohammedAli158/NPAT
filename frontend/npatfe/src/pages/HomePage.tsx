import axios from "axios"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"
import { useContext } from "react"
import { socket } from "../socket/Socket"

const HomePage = () => {
  const { name, setName, setUserId } = useContext(UserContext)
  const nav = useNavigate()

  const handleSubmitClick = async () => {
    let userCreatedInDataBase
    try {
      userCreatedInDataBase = await axios.post(
        import.meta.env.VITE_SERVER_PATH + "/api/user/create-user",
        { Name: name, socketId: socket.id }
      )
      setUserId(userCreatedInDataBase.data.user.id)
    } catch (error) {
      console.error(error)
    }
    if (userCreatedInDataBase) nav("/room-start")
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#E57373] via-[#00BCD4] to-[#FFEB3B] text-gray-800">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg flex flex-col items-center gap-5">
        <h1 className="text-3xl font-bold text-[#E57373]">Welcome to NPAT Universe</h1>
        <input
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Your Name"
          className="outline-none border-2 border-[#00BCD4] rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-[#FFEB3B]"
        />
        <button
          onClick={handleSubmitClick}
          className="bg-[#00BCD4] hover:bg-[#0097a7] text-white py-2 px-6 rounded-lg transition"
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default HomePage
