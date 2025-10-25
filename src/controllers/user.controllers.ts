import type {Request,Response} from "express"
import { prisma} from "../index.ts"
import { nanoid } from "nanoid";



const UserController = {
    createUser :async(req:Request,res:Response)=>  {
        console.log(req.body,"This is req")
        const {Name} = req.body;
        const id = nanoid()
        const user = await prisma.user.create({
            data:{
                Name,id
            }
            
        })
        console.log("This is the created user",user)
        return res.json({"status":"okay"})
    },
    createRoom : async (userId:string,roomName:string,socketId:string,limit:number=5)=>{
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
        return room
    },
    createRound : async(roomId:string,userIds:string[])=>{
        const round = await prisma.round.create({
            data:{
                Room:{
                    connect:{
                        id:roomId
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
    },
    createData : async(userId:string,gameName:string,gamePlace:string,gameAnimal:string,gameThing:string,roundId:string)=>{
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

    },
   disconnectHandler: async (socketId: string) => {
    setTimeout(async () => {
        const remove = await prisma.socketId.findFirst({
            where: { array: { has: socketId } }
        });

        if (!remove || !remove.array) return; // nothing to remove

        const newArray = remove.array.filter(id => id !== socketId);

        await prisma.socketId.update({
            where: { id: remove.id },
            data: { array: { set: newArray } }
        });
    }, 6666);
}

    
    
}
export default UserController