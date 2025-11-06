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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#E57373] via-[#FFEB3B] to-[#00BCD4] text-gray-900">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg flex flex-col gap-3 items-center">
        <h2 className="text-2xl font-semibold text-[#E57373]">
          Current Letter: {currentAlphabet}
        </h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isDisabled}
          className="border-2 border-[#00BCD4] rounded-lg px-4 py-2 w-64"
        />
        <input
          placeholder="Place"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          disabled={isDisabled}
          className="border-2 border-[#00BCD4] rounded-lg px-4 py-2 w-64"
        />
        <input
          placeholder="Animal"
          value={animal}
          onChange={(e) => setAnimal(e.target.value)}
          disabled={isDisabled}
          className="border-2 border-[#00BCD4] rounded-lg px-4 py-2 w-64"
        />
        <input
          placeholder="Thing"
          value={thing}
          onChange={(e) => setThing(e.target.value)}
          disabled={isDisabled}
          className="border-2 border-[#00BCD4] rounded-lg px-4 py-2 w-64"
        />

        <button
          onClick={handleSubmitOnclick}
          disabled={isDisabled}
          className="bg-[#00BCD4] hover:bg-[#0097a7] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-6 rounded-lg mt-2 transition"
        >
          {isDisabled ? "Submitted" : "Submit"}
        </button>
      </div>
    </div>
  )
}

export default RoundPage
