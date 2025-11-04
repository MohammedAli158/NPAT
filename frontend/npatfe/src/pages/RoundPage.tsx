import {  useContext,  useRef, useState } from "react"
import { socket } from "../socket/Socket"
import { UserContext } from "../contexts/UserContext"


const RoundPage = () =>{
  const [isDisabled,setIsDisabled] = useState<boolean>(false)
socket.on("Letter",(data)=>{
  console.log("Letter is emitted",data)
  const {letter} = data;
  setCurrentAlphabet(letter)
})
    const [currentAlphabet,setCurrentAlphabet] = useState<string>("")
    
  const nameRef = useRef<HTMLInputElement>(null);

    const placeRef = useRef<HTMLInputElement>(null);
    const animalRef =useRef<HTMLInputElement>(null);
  const thingRef = useRef<HTMLInputElement>(null);  
    const {userId} = useContext(UserContext)
    const handleSubmitOnclick = ()=>{
        // const array = remainingAlphabets.filter(t=>t!=currentAlphabet)
      //   setRemainingAlphabets(array)
      //  setCount(prev => prev - 1);
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