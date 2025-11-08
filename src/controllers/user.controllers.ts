import type {Request,Response} from "express"
import { prisma} from "../index.ts"
import { nanoid } from "nanoid";
import type { updateData } from "../types/Types.ts"
const UserController = {
    createUser :async(req:Request,res:Response)=>  {
        console.log(req.body,"This is req")
        const {Name,socketId} = req.body;
        const id = nanoid()
        const user = await prisma.user.create({
            data:{
                Name,id,socketId
            }
            
        })
        console.log("This is the created user",user)
        return res.json({"status":"okay","user":user})
    },
    createRoom : async (userId:string,roomName:string,socketId:string,limit:number=5)=>{
        const existing = await prisma.room.findUnique({
            where: { Name:roomName },
        });
    
        const created = !existing;
        const room = await prisma.room.upsert({
            where:{
                Name:roomName
            },
            update:{
                users:{
                    connect:{
                        id:userId
                    }
                }
            },
            create:{
                Name:roomName,
                limit,
                id: nanoid(),
                users:{
                    connect:{
                        id:userId
                    }
                }
            },
            include:{
                users:true
            }
        })
        const socketarray = await prisma.socketId.findFirst({where:{
            roomId:room.id
        }})
        let desArray:string[];
        if (socketarray!=null) {
            desArray=socketarray.array
        }else{
            desArray = ["ali","created","this","awesome","webserver"]
        }
        const socket = await prisma.socketId.upsert({
         where:{
             roomId:room.id
         },
         update:{
            array:[...desArray,socketId]
         },create:{
            roomId:room.id,
            array:[socketId]
         }
        })
        
        return {room,created}
    },
    createRound : async(roomName:string,userIds:string[],roundId:string)=>{
        const roomid = await prisma.room.findFirst({
            where:{
                Name:roomName
            }
        })
        if (roomid) {
            const round = await prisma.round.upsert({
                where:{
                    id:roundId
                },
                update:{
                    Room:{
                    connect:{
                       id:roomid.id
                    }
                },
                users:{
                    connect: userIds.map(id => ({ id }))
                }
                },
            create:{
                Room:{
                    connect:{
                       id:roomid.id
                    }
                },
                users:{
                    connect: userIds.map(id => ({ id }))
                }
            },
            include:{
                Room:true,users:true
            }
        })
        return round
        }
    },
    createData : async(userId:string,gameName:string,gamePlace:string,gameAnimal:string,gameThing:string,roundId:string)=>{
        console.log("shak yakeen")
        const data = await prisma.data.create({
             data: {
                    gameName,
                    gamePlace,
                    gameAnimal,
                    gameThing,
            user: {
                    connect: { id: userId }
                    },
            round: {
                connect: { id: roundId }
                }
  }
}); 
        console.log("shak is still shak")


    },

   disconnectHandler: async (socketId: string):Promise<string>=> {
    let remove,arbitrary:string;
    setTimeout(async () => {
        console.log("This is scoket id from which iam finding room Id",socketId)
         remove = await prisma.socketId.findFirst({
            where: { array: { has: socketId } }
        });

        if (!remove || !remove.array) return; // nothing to remove

        const newArray = remove.array.filter(id => id !== socketId);
        console.log ("This is the room Id",remove.roomId," which contain socket id",socketId)
        await prisma.socketId.update({
            where: { id: remove.id },
            data: { array: { set: newArray } }
        });
        arbitrary = remove && remove.roomId ? remove.roomId : arbitrary
    }, 6666);
    return "ok"
},
    // saveValidatedData : async(socketId: string)
    updateData: async(req:Request,res:Response)=>{
        const data:updateData = req.body
        console.log("updating..",data.gameScore,data.userId)
         await prisma.data.updateMany({
            where:{
                userId:data.userId,roundId:data.roundId
            },
            data:{
                gameScore:data.gameScore
            }
        })
         console.log("updated",data.roundId,data.userId)
         return res.json({"status":"okay"})
    }
    ,
    results : async(req:Request,res:Response)=>{
       const {roomName} = req.body;
       let socketId = await prisma.socketId.findFirst({
        where:{
            room:{
                Name:roomName
            }
        }
       })
       let userIds = []
       let userNames=[]
       let scores =[]
       if (socketId) {
        for (let index = 0; index < socketId.array.length; index++) {
            let user = await prisma.user.findFirst({
                where:{
                    socketId:socketId.array[index]
                }
            })
            userNames[index] = user?.Name
            userIds[index] = user?.id
        }
       
        for (let i = 0; i < userIds.length; i++) {
            console.log("Finding for user : ",userNames[i])
            scores[i] = await prisma.data.aggregate({
            _sum:{
                gameScore:true
            },
            where:{
                userId:userIds[i]
            }
           })
            console.log("this is score for ",userNames[i],scores[i]._sum)
        }


        return res.json({userNames,scores})
       }


      }

        
    // }
    
    
}
export default UserController