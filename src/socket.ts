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
       this.io.on('connect', (socket) => {
  console.log('[server] socket connected', socket.id);
  socket.onAny((ev, ...args) => console.log('[server] onAny', socket.id, ev, args));
  this.startListening(socket);
});
    }
    startListening = async (socket:Socket)=>{
        console.log(socket.id,"this user is connected")
        socket.on('Join Room',async(data)=>{
                //Join room using data base and return some details from query which were required
                const {userId,roomName} = data;
                console.log("Joining room")
                const room =await UserController.createRoom(userId,roomName,socket.id)
                socket.join(room.Name)
                this.io.to(socket.id).emit("Joined Room",room)
                const userNameToBeDisplayedAtFrontEnd = await prisma.user.findFirst({
                    where:{
                        id:userId
                    }
                })
                this.io.to(room.Name).emit("Someone Joined",userNameToBeDisplayedAtFrontEnd)
                
        })
        socket.on("Submit Room",(data)=>{  
            console.log(data,"submitting data")
            //Submit Room and save data recieved in db and make another room and send that rooms id
            socket.emit("Submitted Room",{"Room":"Room56"})
        })
        socket.on("Create Round",async(data)=>{
         const {roomName,userId} = data;
         const round = await prisma.round.create({
            data:{
                users:{
                    connect:{
                        id:userId
                    }
                },Room:{
                    connect:{
                        Name:roomName
                    }
                }
            }
         })
         this.io.to(roomName).emit("Force Create",{roundId:round.id})
        })
        socket.on("Join Round",async(data)=>{
        const {roundId,userId} = data;
        const joinedRound = await prisma.round.update({
            where:{
                id:roundId
            },
            data:{
                users:{
                    connect:{
                        id:userId
                    }
                }
            }
        })

        })
        socket.on("Submit Round",async(data)=>{
            const {gamePlace,gameAnimal,gameThing,gameName,userId,roundId,roomName} = data;
            const createdData = await UserController.createData(userId, gameName, gamePlace, gameAnimal, gameThing, roundId)
            
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
                socket.to(sock.array[(index+1)%sock.array.length]).emit("Validation",data)
            }
            socket.to(roomName).emit("Force Submit Round")

        })
        socket.on("Force Submit Round Socket",async(data)=>{
            const {gamePlace,gameAnimal,gameThing,gameName,userId,roundId,roomName} = data;
            const createdData = await UserController.createData(userId, gameName, gamePlace, gameAnimal, gameThing, roundId)
            
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
                socket.to(sock.array[(index+1)%sock.array.length]).emit("Validation",data)
            }
        })

        socket.on("disconnect",async(data)=>{
            console.log("deleting..")
            const roomId = await UserController.disconnectHandler(socket.id)
            if (roomId=="a") {
                console.log("a hai value yarooo")
                return 
            }
            console.log("deleted","this is room id",roomId)
            const roomName = await prisma.room.findFirst({
                where:{
                    id:roomId
                }
            })
            console.log("Thi is the room name",roomName)
            const username = await prisma.user.findFirst({
                where:{
                    socketId:socket.id
                }
            })
            console.log("This is room name : ", roomName?.Name,username)
            this.io.to("text-abc").emit("Left Room",{username:username?.Name})
            
        })
        
    }
}