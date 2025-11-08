import { useContext, useState } from "react"
import type { ChangeEvent } from "react";
import { socket } from "../socket/Socket"
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const ValidatePage = () =>{
  const [nameScore,setNameScore] = useState<number>(0)
  const [placecore,setPlaceScore] = useState<number>(0)
  const [animalScore,setAnimalScore] = useState<number>(0)
  const [thingScore,setThingScore] = useState<number>(0)
  const [incameData,setIncameData] = useState<object>()
  const {roundIds,roomName} = useContext(UserContext)
const [userId, setUserId] = useState<string>("")
    const nav = useNavigate();
     socket.on("Next Round",()=>{
       console.log("Navigating from here",roundIds?.length)
       if (roundIds && roundIds.length >= 5) {
         nav("/results-page")
        } else {
          nav("/room-home")
        }
      })
      
      socket.on("Validation",(data)=>{
        setIncameData(data)
       setUserId(data.userId)
        console.log("This is userId naaa",userId)
        console.log(data,"data came")
      })
      const handleSubmit =async (e:ChangeEvent<HTMLInputElement>) =>{
        e.target.disabled = true;
        const gameScore = nameScore + placecore + animalScore + thingScore;
      console.log("this is total score being sent",userId)
      const toSend = {
         roundId : roundIds ? roundIds[roundIds.length-1] : " " ,userId,gameScore
      }
     try {
        await axios.post(import.meta.env.VITE_SERVER_PATH+"/api/user/submit-validated-data",toSend)
        console.log("navigating...")
        socket.emit("Ready",{roomName})
        nav("/ready-page")
      } catch (error) {
        console.error(error)
      }
    }
    
    const handleNameOnchange = (e: ChangeEvent<HTMLInputElement>) =>{
      const num = parseInt(e.target.value)
      setNameScore(num)
    }
    
    const handlePlaceOnchange = (e: ChangeEvent<HTMLInputElement>) =>{
      const num = parseInt(e.target.value)
      setPlaceScore(num)
    }
    
    const handleAnimalOnchange = (e: ChangeEvent<HTMLInputElement>) =>{
      const num = parseInt(e.target.value)
      setAnimalScore(num)
    }
    
    const handleThingOnchange = (e: ChangeEvent<HTMLInputElement>) =>{
      const num = parseInt(e.target.value)
      setThingScore(num)
    }
    
    
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02),transparent_50%)]"></div>

        <div className="relative z-10 bg-zinc-900 border border-zinc-800 p-12 rounded-2xl shadow-2xl flex flex-col items-center gap-8 max-w-2xl w-full mx-4">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">Validation Page</h1>
            <p className="text-zinc-400 text-sm">Score the responses</p>
          </div>

          <div className="w-full overflow-hidden rounded-lg border border-zinc-800">
            <table className="w-full">
              <tbody className="divide-y divide-zinc-800">
                <tr className="bg-zinc-950/50">
                  <th className="px-6 py-4 text-left font-semibold text-white border-r border-zinc-800">Name</th>
                  <td className="px-6 py-4 text-zinc-300 border-r border-zinc-800">{incameData?.gameName || " "}</td>
                  <td className="px-6 py-4">
                    <input
                      onChange={handleNameOnchange}
                      value={nameScore}
                      type="number"
                      min="0"
                      max="10"
                      step="5"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-200"
                    />
                  </td>
                </tr>
                <tr className="bg-zinc-950/50">
                  <th className="px-6 py-4 text-left font-semibold text-white border-r border-zinc-800">Place</th>
                  <td className="px-6 py-4 text-zinc-300 border-r border-zinc-800">{incameData?.gamePlace || " "}</td>
                  <td className="px-6 py-4">
                    <input
                      onChange={handlePlaceOnchange}
                      value={placecore}
                      type="number"
                      min="0"
                      max="10"
                      step="5"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-200"
                    />
                  </td>
                </tr>
                <tr className="bg-zinc-950/50">
                  <th className="px-6 py-4 text-left font-semibold text-white border-r border-zinc-800">Animal</th>
                  <td className="px-6 py-4 text-zinc-300 border-r border-zinc-800">{incameData?.gameAnimal || " "}</td>
                  <td className="px-6 py-4">
                    <input
                      onChange={handleAnimalOnchange}
                      value={animalScore}
                      type="number"
                      min="0"
                      max="10"
                      step="5"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-200"
                    />
                  </td>
                </tr>
                <tr className="bg-zinc-950/50">
                  <th className="px-6 py-4 text-left font-semibold text-white border-r border-zinc-800">Thing</th>
                  <td className="px-6 py-4 text-zinc-300 border-r border-zinc-800">{incameData?.gameThing || " "}</td>
                  <td className="px-6 py-4">
                    <input
                      onChange={handleThingOnchange}
                      value={thingScore}
                      type="number"
                      min="0"
                      max="10"
                      step="5"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-200"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-white text-zinc-950 font-semibold py-3.5 px-6 rounded-lg hover:bg-zinc-100 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Submit Scores
          </button>
        </div>
      </div>
    )
}

export default ValidatePage