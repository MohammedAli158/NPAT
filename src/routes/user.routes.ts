import {Router} from "express"
import UserController from "../controllers/user.controllers.ts"
const userRoutes = Router()
userRoutes.post('/create-user',UserController.createUser)
userRoutes.post('/submit-data',UserController.updateData)
userRoutes.post('/submit-validated-data',UserController.updateData)

export default userRoutes