import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import { useNavigate } from "react-router-dom"
import { socket } from "../socket/Socket"

const ReadyPage = ()=>{
    const nav = useNavigate()
    const {roundIds} = useContext(UserContext)

    socket.on("Next Round",()=>{
        console.log("Navigating from here",roundIds?.length)
        if (roundIds && roundIds.length >= 5) {
            nav("/results-page")
        } else {
            nav("/room-home")
        }
    })
    
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-950 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02),transparent_50%)]"></div>

            <div className="relative z-10 bg-zinc-900 border border-zinc-800 p-12 rounded-2xl shadow-2xl flex flex-col items-center gap-8 max-w-md w-full mx-4 text-center">
                <div className="space-y-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 animate-pulse mx-auto"></div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Waiting for Players</h1>
                    <p className="text-zinc-400 text-lg">All members to finish submitting</p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span>Connected and waiting...</span>
                </div>
            </div>
        </div>
    )
}

export default ReadyPage