import {Server as HTTPServer} from "http"
import {Server,Socket} from "socket.io"
import UserController from "./controllers/user.controllers.ts";
import {prisma} from "./index.ts"
export class SocketCreator{
    public static instance: SocketCreator
    public io:Server
    constructor(server:HTTPServer){
        SocketCreator.instance = this;
        this.io = new Server(server,{
            cors:{
                origin:'*'
            }
        })
        this.io.on('connect',this.startListening)
    }
    startListening = async (socket:Socket)=>{
        console.log(socket.id,"this user is connected")
        socket.on('Join Room',async(data)=>{
                //Join room using data base and return some details from query which were required
                const {userId,roomName} = data;
                const room =await UserController.createRoom(userId,roomName,socket.id)
                socket.join(room.Name)
                this.io.to(room.Name).emit("Joined Room",room)
                
        })
        socket.on("Submit Room",(data)=>{  
            console.log(data,"submitting data")
            //Submit Room and save data recieved in db and make another room and send that rooms id
            socket.emit("Submitted Room",{"Room":"Room56"})
        })
        socket.on("Create Round",async(data)=>{
            const {roomId,userIds} = data
           const roundobj = await prisma.room.findUnique({
                where:{
                    id:roomId
                },
                select:{
                    rounds:true,Name:true
                }
            })
            if (roundobj!=null && roundobj.rounds.length >5) {
                return this.io.emit("Rounds Exceeded")
            }
            const round = await UserController.createRound(roomId,userIds);
            this.io.to(roundobj!=null?roundobj.Name:"").emit("Created Round",round)
        })
        socket.on("Submit Round",async(data)=>{
            const {gamePlace,gameAnimal,gameThing,gameName,userId,roundId} = data;
            const createdData = await UserController.createData(gamePlace,gameAnimal,gameThing,gameName,userId,roundId)

            const sock = await prisma.socketId.findFirst({
                where:{
                    array:{
                        has:socket.id
                    }
                }
            })
            let index:number = -5
            
            if (sock && sock.array) {
                let 
                 index = sock.array.indexOf(socket.id);
                 socket.to(sock.array[(index+1)%sock.array.length]).emit(data)
            }

        })
        socket.on("disconnect",async(data)=>{
            console.log("deleting..")
            await UserController.disconnectHandler(socket.id)
            console.log("deleted")
        })
        
    }
}