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
    const handleOnPlay = async()=>{
        socket.emit("Create Round",{roomName,userId})
        
        
    }
    // let roundId;
    // useEffect(()=>{
    //     if (roundIds) {
    //         roundId = roundIds[roundIds.length - 1]
    //     }
    // },[roundIds])
    socket.on("Force Create",(data)=>{
            const roundId:string=data.roundId
            console.log(roundId,"is rondid")
            if (roundIds) {
                setRoundIds([...roundIds,roundId]) 
            }else{
                setRoundIds([roundId])
            }
            if (roundIds?.length === 5) {
                setRoundsFinish(true);
            } else {
                nav('/round-page');
            }
            
            console.log("Emitted Join Round",roundId)
            socket.emit("Join Round",{roundId,userId,roomName})
        })
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
                }{
                    roundsFinish ? <h1>Rounds FINISHED...</h1> : " "
                }
                <button className="bg-gray-500 rounded-full px-5 text-white" onClick={handleOnPlay} >Start Playing</button>
        </div>
    )
}
export default RoomHome