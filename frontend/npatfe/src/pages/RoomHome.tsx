import { useContext, useState } from "react"
import { socket } from "../socket/Socket"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"
const RoomHome = ()=>{
    const [joinedArray,setJoinedArray] = useState<string[]>([])
    const [leftArray,setLeftArray] = useState<string[]>([])
    const [roundsFinish,setRoundsFinish] = useState<boolean>(false)
    socket.on("Someone Joined",(data)=>{
        setJoinedArray([...joinedArray,data.Name])
    })
    socket.on("Left Room",(data)=>{
        console.log("Left Room is being triggered")
        const name = data.username
       setLeftArray([...leftArray,name])

    })
    const nav = useNavigate()
    const {roomName,userId,setRoundIds,roundIds}= useContext(UserContext)
    const handleOnPlay = ()=>{
        socket.emit("Create Round",{roomName,userId})
        socket.on("Force Create",(data)=>{
            const roundId:string=data.string
            if (roundIds) {
                setRoundIds([...roundIds,roundId]) 
            }else{
            setRoundIds([roundId])
            }
        })
        roundIds?.length==5 ? setRoundsFinish(true) : nav('/round-page')
        

    }
    return (
        <div className="flex flex-col justify-center items-center " >
                this is room home
                {
                    joinedArray? joinedArray.map((t,i)=>{
                        return (<div key={i} >
                            {t}- Joined
                        </div>)
                    }) : ""
                }
                {
                    leftArray ?  leftArray.map((t,i)=>{
                        console.log("If this is working, something is wrong with sockets")
                        return (
                            <div key={i} >
                                {t}-left
                            </div>
                        )
                    }) : " "
                }
                <button className="bg-gray-500 rounded-full px-5 text-white" onClick={handleOnPlay} >Start Playing</button>
        </div>
    )
}
export default RoomHome