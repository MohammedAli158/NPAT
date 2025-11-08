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
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02),transparent_50%)]"></div>

      <div className="relative z-10 bg-zinc-900 border border-zinc-800 p-12 rounded-2xl shadow-2xl flex flex-col items-center gap-8 max-w-md w-full mx-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Welcome to NPAT Universe</h1>
          <p className="text-zinc-400 text-sm">Enter your name to continue</p>
        </div>

        <div className="w-full space-y-4">
          <input
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-5 py-3.5 text-white placeholder:text-zinc-500 outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-200"
          />

          <button
            onClick={handleSubmitClick}
            className="w-full bg-white text-zinc-950 font-semibold py-3.5 px-6 rounded-lg hover:bg-zinc-100 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Submit
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>Secure connection active</span>
        </div>
      </div>
    </div>
  )
}

export default HomePage