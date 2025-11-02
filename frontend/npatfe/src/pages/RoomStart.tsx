import { useContext, useState } from "react"
import { UserContext } from "../contexts/UserContext"

const RoomStart = () =>{
    const {name} = useContext(UserContext)
    const [roomName,setRoomName] = useState<string>("test-abc")
return (
    <div>   
        <input onChange={(e)=>setRoomName(e.target.value)} placeholder="Create Room" className="outline-none" />
    </div>
)
}
export default RoomStart