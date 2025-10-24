import {Router} from "express"
import UserController from "../controllers/user.controllers.ts"
const userRoutes = Router()
userRoutes.post('/create-user',UserController.createUser)

export default userRoutes