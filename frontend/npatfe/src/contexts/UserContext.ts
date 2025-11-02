import { createContext } from "react";
interface UserContextType {
name: string;
setName: React.Dispatch<React.SetStateAction<string>>;
userId: string | null;
setUserId:React.Dispatch<React.SetStateAction<string>>;
roomName: string | null;
setRoomName : React.Dispatch<React.SetStateAction<string>>;
roundIds: string[] | null;
setRoundIds:React.Dispatch<React.SetStateAction<[string]>>;
}
export const UserContext = createContext<UserContextType>({
  name: '',
setName: () => {},
userId: null ,
setUserId: () => {},
roomName: null ,
setRoomName: () => {},
roundIds: null,
setRoundIds: () => {}
})