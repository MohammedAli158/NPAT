import express from "express"
import type {Request,Response,Application} from "express"
import http from "http"
import {PrismaClient} from "@prisma/client"
import userRoutes from "./routes/user.routes.ts"
import { SocketCreator } from "./socket.ts"
import cors from "cors"

export const prisma = new PrismaClient()
 const app:Application = express()
app.use(express.json());
const httpServer = http.createServer(app)
new SocketCreator(httpServer)

app.use(cors())
app.get('/',(req:Request,res:Response)=>{
    res.send("Welcome There")
})
app.use('/api/user',userRoutes)
httpServer.listen(8580, () => console.log("Server running on 8080"));
console.log("This is id")
