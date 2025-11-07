import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import { useNavigate } from "react-router-dom"
import { socket } from "../socket/Socket"
const ReadyPage = ()=>{
    const nav = useNavigate()
    const {roundIds} = useContext(UserContext)
    socket.on("Next Round",()=>{
        if (roundIds &&roundIds.length>=5) {
            nav("/results-page")
        }else{
            nav("/room-home")
        }
    })
    return (
        <h1>Waiting for all Members to Finish Submitting </h1>
    )
}
export default ReadyPage