import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import { socket } from "../socket/Socket"

const ResultsPage = ()=>{
    type customObj = {
        _sum : {
            gameScore:number
        }
    }

    const {roomName,roundIds,isOwner,userId} = useContext(UserContext)
    const [names,setNames] = useState<string[]>([" "])
    const [scores,setScores] = useState<customObj[]>([{_sum:{gameScore:55}}]) 
    
    const init = async()=>{
        console.log(names)
         try {
        const data = await axios.post(import.meta.env.VITE_SERVER_PATH+"/api/user/results",{roomName})
        console.log(data.data,"from be")
        setNames(data.data.userNames)
        setScores(data.data.scores)
    } catch (error) {
        console.error(error)
    }
}
    
    useEffect(()=>{
        init()
       
    },[])

    setTimeout(() => {
         if (isOwner) {
            socket.emit("Cleanup",{roomName,roundIds})
        }
        socket.emit("Cleanup User",{userId})
    }, 6666);
    
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-950 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02),transparent_50%)]"></div>

            <div className="relative z-10 bg-zinc-900 border border-zinc-800 p-12 rounded-2xl shadow-2xl flex flex-col items-center gap-8 max-w-2xl w-full mx-4">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-white tracking-tight">Final Results</h1>
                    <p className="text-zinc-400 text-sm">Game summary and scores</p>
                </div>

                <div className="w-full overflow-hidden rounded-lg border border-zinc-800">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-zinc-800/50">
                                <th className="px-6 py-4 text-left font-semibold text-white border-r border-zinc-700">Player</th>
                                <th className="px-6 py-4 text-left font-semibold text-white">Total Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {names.map((t,i)=>{
                                return (
                                    <tr key={i} className="bg-zinc-950/50 hover:bg-zinc-800/30 transition-colors duration-150">
                                        <td className="px-6 py-4 text-zinc-300 border-r border-zinc-800 font-medium">{t}</td>
                                        <td className="px-6 py-4 text-white font-semibold text-lg">
                                            {scores[i]._sum.gameScore}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span>Game completed successfully</span>
                </div>
            </div>
        </div>
    )
}

export default ResultsPage