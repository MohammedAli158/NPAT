import { useContext, useEffect, useState } from "react"
import { socket } from "../socket/Socket"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"
import { getRandomAlphabet } from "../util/RandomAlphabet"

const RoomHome = () => {
  const [joinedArray, setJoinedArray] = useState<string[]>([])
  const [leftArray, setLeftArray] = useState<string[]>([])
  const [roundsFinish, setRoundsFinish] = useState<boolean>(false)
  const { roomName, userId, isOwner, setRoundIds, roundIds,letters, setLetters, setIsOwner } = useContext(UserContext)
  const nav = useNavigate()

  useEffect(() => {
    socket.on("Someone Joined", (data) => {
      setJoinedArray((prev) => [...prev, data.userNameToBeDisplayedAtFrontEnd?.Name])
    })

    socket.on("Owner", () => {
      setIsOwner(true)
    })

    socket.on("Left Room", (data) => {
      setLeftArray((prev) => [...prev, data.username])
    })

    socket.on("Finalized Letters Array", (data) => {
      console.log("Received Finalized Letters Array:", data)
      if (letters && letters.length==5) {
        console.log()
      }else{

        setLetters(data)
      }
    })

    socket.on("Force Create", (data) => {
      const roundId: string = data.roundId
      if (roundIds) setRoundIds((prev) => [...(prev || []), roundId])
      else setRoundIds([roundId])

      if ((roundIds?.length || 0) + 1 == 5) {
        setRoundsFinish(true)
        nav("/results-page")
      }
      else nav("/round-page")

      socket.emit("Join Round", { roundId, userId, roomName })
    })

    return () => {
      socket.off("Someone Joined")
      socket.off("Owner")
      socket.off("Left Room")
      socket.off("Finalized Letters Array")
      socket.off("Force Create")
    }
  }, [roomName, userId, roundIds, setRoundIds, setLetters, setIsOwner, nav])

  const handleOnPlay = () => {
    socket.emit("Create Round", { roomName, userId })
    const letters: string[] = []

    if (isOwner) {
      for (let index = 0; index < 5; index++) {
        letters[index] = getRandomAlphabet()
      }
      socket.emit("Letters From FrontEnd", { roomName, data: letters })
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02),transparent_50%)]"></div>

      <div className="relative z-10 bg-zinc-900 border border-zinc-800 p-12 rounded-2xl shadow-2xl flex flex-col items-center gap-8 max-w-md w-full mx-4">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">Room Home</h2>
        </div>

        <div className="w-full space-y-3">
          {joinedArray.map((t, i) => (
            <div key={i} className="text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-4 py-2 text-sm">{t} - Joined</div>
          ))}

          {leftArray.map((t, i) => (
            <div key={i} className="text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-lg px-4 py-2 text-sm">{t} - Left</div>
          ))}
        </div>

        {roundsFinish && (
          <div className="text-center space-y-2">
            <div className="w-4 h-4 rounded-full bg-rose-500 animate-pulse mx-auto"></div>
            <h1 className="text-lg font-bold text-rose-500">Rounds FINISHED...</h1>
          </div>
        )}

        <button
          className={"w-full bg-white text-zinc-950 font-semibold py-3.5 px-6 rounded-lg hover:bg-zinc-100 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]" + (isOwner ? " " : " hidden" )+ (roundsFinish ? " hidden" : " " )}
          onClick={handleOnPlay}
        >
          Start Playing
        </button>
      </div>
    </div>
  )
}

export default RoomHome