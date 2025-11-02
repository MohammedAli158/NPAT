import './App.css'
import {Routes,Route} from "react-router-dom"
import HomePage from './pages/HomePage'
import RoomStart from './pages/RoomStart'
import {   useState } from 'react'
import { UserContext, } from './contexts/UserContext'
function App() {
  const [name,setName] = useState<string>("bob-paris")
  const [userId,setUserId] = useState<string>("bobackdsauhfjis")
  const [roomName,setRoomName] = useState<string>("HIEAHFE")
  const [roundIds,setRoundIds] = useState<[string]>(["a"])
  
  return (
    <UserContext.Provider value={{name,setName,userId,roomName,roundIds,setUserId,setRoomName,setRoundIds}} >
      <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/room-start' element={<RoomStart/>} />
    </Routes>
    </UserContext.Provider>
  )
}

export default App
