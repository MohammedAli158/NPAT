import { useContext, useRef, useState } from "react"
import { socket } from "../socket/Socket"
import { UserContext } from "../contexts/UserContext"

const RoundPage = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [currentAlphabet, setCurrentAlphabet] = useState<string>("")
  const { userId } = useContext(UserContext)

  socket.on("Letter", (data) => setCurrentAlphabet(data.letter))

  const nameRef = useRef<HTMLInputElement>(null)
  const placeRef = useRef<HTMLInputElement>(null)
  const animalRef = useRef<HTMLInputElement>(null)
  const thingRef = useRef<HTMLInputElement>(null)

  const handleSubmitOnclick = () => {
    setIsDisabled(true)
    const details = {
      gameName: nameRef.current?.value || " ",
      gamePlace: placeRef.current?.value || " ",
      gameAnimal: animalRef.current?.value || " ",
      gameThing: thingRef.current?.value || " ",
      userId,
    }
    socket.emit("Submit Round", details)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#E57373] via-[#FFEB3B] to-[#00BCD4] text-gray-900">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg flex flex-col gap-3 items-center">
        <h2 className="text-2xl font-semibold text-[#E57373]">Current Letter: {currentAlphabet}</h2>
        <input placeholder="Name" ref={nameRef} disabled={isDisabled} className="border-2 border-[#00BCD4] rounded-lg px-4 py-2 w-64" />
        <input placeholder="Place" ref={placeRef} disabled={isDisabled} className="border-2 border-[#00BCD4] rounded-lg px-4 py-2 w-64" />
        <input placeholder="Animal" ref={animalRef} disabled={isDisabled} className="border-2 border-[#00BCD4] rounded-lg px-4 py-2 w-64" />
        <input placeholder="Thing" ref={thingRef} disabled={isDisabled} className="border-2 border-[#00BCD4] rounded-lg px-4 py-2 w-64" />
        <button
          onClick={handleSubmitOnclick}
          className="bg-[#00BCD4] hover:bg-[#0097a7] text-white py-2 px-6 rounded-lg mt-2 transition"
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default RoundPage
