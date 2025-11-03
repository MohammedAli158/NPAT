import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import {socket} from "../socket/Socket"
import { useNavigate } from "react-router-dom"

const RoomStart = () =>{
    const nav = useNavigate()
    const {roomName,setRoomName,userId} = useContext(UserContext)
    const handleEnterClick =async()=>{
        console.log("Enter is clicked")
        socket.emit("Join Room",{userId,roomName})
        socket.on("Joined Room",(data)=>{
            console.log("The socket is created, room is joined",data)
        })
        nav('/room-home')
    }
return (
    <div className="flex flex-col justify-center items-center" >   
        <input onChange={(e)=>setRoomName(e.target.value)} placeholder="Create Room" className="outline-none mt-5 ml-5" />
                <input onChange={(e)=>setRoomName(e.target.value)} placeholder="Join Room" className="outline-none mt-5 ml-5" />
                <button onClick={handleEnterClick}  className="bg-gray-300 py-2 px-5 rounded-md" >Enter</button>
    </div>
)
}
export default RoomStart