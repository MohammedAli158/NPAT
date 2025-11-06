import './App.css'
import {Routes,Route} from "react-router-dom"
import HomePage from './pages/HomePage'
import RoomStart from './pages/RoomStart'
import {   useState } from 'react'
import { UserContext, } from './contexts/UserContext'
import RoundPage from './pages/RoundPage'
import RoomHome from './pages/RoomHome'
import ValidatePage from './pages/ValidatePage'
function App() {
  const [name,setName] = useState<string>("bob-paris")
  const [userId,setUserId] = useState<string>("bobackdsauhfjis")
  const [roomName,setRoomName] = useState<string>("HIEAHFE")
  const [roundIds,setRoundIds] = useState<string[]>([])
  const [letters,setLetters]=useState<string[]>([])
  const [isOwner,setIsOwner] = useState<boolean>(false)
  
  return (
    <UserContext.Provider value={{isOwner,setIsOwner,letters,setLetters,name,setName,userId,roomName,roundIds,setUserId,setRoomName,setRoundIds}} >
      <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/room-start' element={<RoomStart/>} />
      <Route path='/room-home' element={<RoomHome/>} />
      <Route path='/round-page' element={<RoundPage/>} />
      <Route path='/validate-page' element={<ValidatePage/>} />
    </Routes>
    </UserContext.Provider>
  )
}

export default App
