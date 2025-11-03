// import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"
import { useContext } from "react"
import { socket } from "../socket/Socket"
const HomePage = ()=>{
    const {name,setName,setUserId} = useContext(UserContext)
    const nav = useNavigate()
    const handleSubmitClick = async ()=>{
        let userCreatedInDataBase;
       try {
         userCreatedInDataBase =  await axios.post(import.meta.env.VITE_SERVER_PATH+"/api/user/create-user",{Name:name,socketId:socket.id})
         setName(name)
         console.log(userCreatedInDataBase)
         setUserId ( userCreatedInDataBase.data.user.id)
       } catch (error) {
        console.error(error)
       }
       if (userCreatedInDataBase) {
        nav('/room-start')
       }

    }
    return (
        <div className="flex flex-col justify-center items-center gap-5" >
            <h1 className="mt-5" >Welcome to NPAT Universe</h1>
            <input onChange={(e)=>setName(e.target.value)} placeholder="Enter Your Name" className="outline-none" />
            <button onClick={handleSubmitClick}  className="bg-gray-300 py-2 px-5 rounded-md" >Submit</button>
        </div>
    )
}
export default HomePage