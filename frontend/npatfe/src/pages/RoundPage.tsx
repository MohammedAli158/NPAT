import {  useContext, useEffect, useRef, useState } from "react"
import { socket } from "../socket/Socket"
import { UserContext } from "../contexts/UserContext"


const RoundPage = () =>{
    const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    const [isDisabled,setIsDisabled] = useState<boolean>(false)
    const [remainingAlphabets,setRemainingAlphabets] = useState<string[]>(alphabets)
    const [currentAlphabet,setCurrentAlphabet] = useState<string>("")
    const [count,setCount ] = useState<number>(26)
  const nameRef = useRef<HTMLInputElement>(null);

    const placeRef = useRef<HTMLInputElement>(null);
    const animalRef =useRef<HTMLInputElement>(null);
  const thingRef = useRef<HTMLInputElement>(null);  
   useEffect(()=>{
        setCurrentAlphabet(remainingAlphabets[Math.ceil (count*Math.random ())])
    },[count])
    const {userId} = useContext(UserContext)
    const handleSubmitOnclick = ()=>{
        const array = remainingAlphabets.filter(t=>t!=currentAlphabet)
        setRemainingAlphabets(array)
       setCount(prev => prev - 1);
       setIsDisabled(true)
       const details = {
        gameName :nameRef.current ? nameRef.current.value : " ",
        gamePlace : placeRef.current ? placeRef.current.value : " ",
        gameAnimal : animalRef.current ? animalRef.current.value : " ",
        gameThing : thingRef.current? thingRef.current.value :  " ",
        userId ,


       }
       
    socket.emit("Submit Round",details)

    }
    return (
       <div className="flex flex-col justify-center items-center" >
        <div>
            letter is - {currentAlphabet}
        </div>
        <input placeholder="Name"  type="text"   ref={nameRef}  disabled={isDisabled}   />
        <input placeholder="Place" type="text"    ref={placeRef}  disabled={isDisabled} />
        <input placeholder="Animal" type="text"  ref={animalRef}   disabled={isDisabled}  />
        <input placeholder="Thing" type="text"   ref={thingRef}   disabled={isDisabled} />

        <button onClick={handleSubmitOnclick} >Submit</button>
       </div>
    )
}
export default RoundPage