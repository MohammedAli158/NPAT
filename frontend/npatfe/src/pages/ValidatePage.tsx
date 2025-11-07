import { useContext, useState } from "react"
import type { ChangeEvent } from "react";
import { socket } from "../socket/Socket"
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
// import type { Incame } from "../types/Types";
const ValidatePage = () =>{
    const [nameScore,setNameScore] = useState<number>(0)
    const [placecore,setPlaceScore] = useState<number>(0)
    const [animalScore,setAnimalScore] = useState<number>(0)
    const [thingScore,setThingScore] = useState<number>(0)
    const [incameData,setIncameData] = useState<object>()
    const {roundIds,roomName} = useContext(UserContext)
    let userId:string
    const nav = useNavigate();
    const handleSubmit =async (e:ChangeEvent<HTMLInputElement>) =>{
      e.target.disabled = true;
      //request to server to save the data
      const gameScore = nameScore + placecore + animalScore + thingScore;
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
    
socket.on("Validation",(data)=>{
           setIncameData(data)
           userId = data.userId
           console.log(data,"data came")
        })
    return (
         <div className="flex flex-col justify-center items-center">
<table>
  <tbody>
    <tr>
      <th>Name</th>
      <td>{incameData?.gameName || " "}</td>
      <td><input
      onChange= {handleNameOnchange}
      value={nameScore}
  type="number"
  min="0"
  max="10"
  step="5"
  className="border px-2 py-1 rounded"
/>
</td>
    </tr>
    <tr>
      <th>Place</th>
      <td>{incameData?.gamePlace || " "}</td>
      <td><input
       onChange={handlePlaceOnchange}
  type="number"
  value={placecore}
  min="0"
  max="10"
  step="5"
  className="border px-2 py-1 rounded"
/>
</td>
    </tr>
    <tr>
      <th>Animal</th>
      <td>{incameData?.gameAnimal || " "}</td>
      <td><input
       onChange={handleAnimalOnchange}
       value={animalScore}
  type="number"
  min="0"
  max="10"
  step="5"
  className="border px-2 py-1 rounded"
/>
</td>
    </tr>
    <tr>
      <th>Thing</th>
      <td>{incameData?.gameThing || " "}</td>
      <td><input
       onChange={handleThingOnchange}
       value={thingScore}
  type="number"
  min="0"
  max="10"
  step="5"
  className="border px-2 py-1 rounded"
/>
</td>
    </tr>
  </tbody>
</table>
<button onClick={handleSubmit} >Submit</button>

    </div>
    )
}
export default ValidatePage