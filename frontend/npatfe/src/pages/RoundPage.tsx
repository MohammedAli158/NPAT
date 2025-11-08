import { useContext, useEffect, useRef, useState } from "react"
import { socket } from "../socket/Socket"
import { UserContext } from "../contexts/UserContext"
import { useNavigate } from "react-router-dom"

const RoundPage = () => {

  const nav = useNavigate()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [currentAlphabet, setCurrentAlphabet] = useState<string>("")
  const { userId, letters, roundIds, roomName } = useContext(UserContext)

  const [name, setName] = useState<string>("")
  const [place, setPlace] = useState<string>("")
  const [animal, setAnimal] = useState<string>("")
  const [thing, setThing] = useState<string>("")

  // persistent refs for latest values
  const nameRef = useRef(name)
  const placeRef = useRef(place)
  const animalRef = useRef(animal)
  const thingRef = useRef(thing)

  useEffect(() => { nameRef.current = name }, [name])
  useEffect(() => { placeRef.current = place }, [place])
  useEffect(() => { animalRef.current = animal }, [animal])
  useEffect(() => { thingRef.current = thing }, [thing])

  const submittedRef = useRef<boolean>(false)

  useEffect(() => {
    if (letters) {
      setCurrentAlphabet(letters[roundIds ? roundIds.length - 1 : 0])
    }
  }, [roundIds, letters])

  useEffect(() => {
    const handleForceSubmit = () => {
      const currentRoundId = roundIds ? roundIds[roundIds.length - 1] : undefined
      const details = {
        gameName: nameRef.current,
        gamePlace: placeRef.current,
        gameAnimal: animalRef.current,
        gameThing: thingRef.current,
        userId,
        roundId: currentRoundId,
        roomName
      }
      console.log("Force Submit sending details:", details)
      socket.emit("Force Submit Round Socket", details)
      nav("/validate-page")
    }

    socket.on("Force Submit Round", handleForceSubmit)
    return () => socket.off("Force Submit Round", handleForceSubmit)
  }, [roundIds, roomName, userId, nav])

  const handleSubmitOnclick = () => {
    if (submittedRef.current) {
      console.log("Already submitted, ignoring")
      return
    }

    setIsDisabled(true)
    submittedRef.current = true
    const details = { roomName }
    console.log("Submitting details:", details)
    socket.emit("Submit Round", details)
    nav("/validate-page")
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02),transparent_50%)]"></div>

      <div className="relative z-10 bg-zinc-900 border border-zinc-800 p-12 rounded-2xl shadow-2xl flex flex-col items-center gap-8 max-w-md w-full mx-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Round Page</h1>
          <p className="text-zinc-400 text-sm">Current Letter</p>
          <div className="text-6xl font-bold text-white bg-zinc-800 border border-zinc-700 rounded-2xl px-8 py-4 mt-4">
            {currentAlphabet}
          </div>
        </div>

        <div className="w-full space-y-4">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isDisabled}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-5 py-3.5 text-white placeholder:text-zinc-500 outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            placeholder="Place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            disabled={isDisabled}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-5 py-3.5 text-white placeholder:text-zinc-500 outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            placeholder="Animal"
            value={animal}
            onChange={(e) => setAnimal(e.target.value)}
            disabled={isDisabled}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-5 py-3.5 text-white placeholder:text-zinc-500 outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            placeholder="Thing"
            value={thing}
            onChange={(e) => setThing(e.target.value)}
            disabled={isDisabled}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-5 py-3.5 text-white placeholder:text-zinc-500 outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleSubmitOnclick}
          disabled={isDisabled}
          className="w-full bg-white text-zinc-950 font-semibold py-3.5 px-6 rounded-lg hover:bg-zinc-100 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
        >
          {isDisabled ? "Submitted" : "Submit"}
        </button>
      </div>
    </div>
  )
}

export default RoundPage