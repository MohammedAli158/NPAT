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
    createRoom : async (userId:string,roomName:string,limit:number=5)=>{
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
        console.log(room)
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
    } 
    
}
export default UserController