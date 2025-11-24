import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import UserController from "./controllers/user.controllers.ts";
import { prisma } from "./index.ts";
import { getRandomAlphabet } from "./util/RandomAlphabet.ts";
import type { Count } from "./types/Types.ts";

export class SocketCreator {
  public static instance: SocketCreator;
  public io: Server;
  public count: Count;

  constructor(server: HTTPServer) {
    SocketCreator.instance = this;
    this.io = new Server(server, {
      cors: {
        origin: ["https://name-place-animal-thing.vercel.app" ],
        methods: ["GET", "POST"],
      },
       transports: ["websocket", "polling"],
        pingTimeout: 8000,   
         pingInterval: 4000,
    });
    this.count = {};
    this.io.on("connect", (socket) => {
      this.startListening(socket);
    });
  }

  startListening = async (socket: Socket) => {
    socket.on("Join Room", async (data) => {
      const { userId, roomName } = data;
      this.count[roomName] = 0;
      try {
        const room = await UserController.createRoom(userId, roomName, socket.id);
        socket.join(room.room.Name);
        this.io.to(socket.id).emit("Joined Room", room.room);
        const userNameToBeDisplayedAtFrontEnd = await prisma.user.findFirst({
          where: { id: userId },
        });
        if (room.created) socket.emit("Owner", { data: true });
        console.log(userNameToBeDisplayedAtFrontEnd,"is emitted someone joined")
        this.io.to(room.room.Name).emit("Someone Joined", {
          userNameToBeDisplayedAtFrontEnd,
        });
      } catch (error: any) {
        console.log(error.message);
      }
    });

    socket.on("Submit Room", (data) => {
      socket.emit("Submitted Room", { Room: "Room56" });
    });

    socket.on("Create Round", async (data) => {
      const { roomName, userId } = data;
      try {
        let roomId = await prisma.room.findFirst({
          where: { Name: roomName },
          include: { users: true },
        });
        const round = await prisma.round.create({
          data: {
            users: { connect: { id: userId } },
            Room: { connect: { id: roomId?.id } },
          },
        });
        this.io.to(roomName).emit("Force Create", { roundId: round?.id });
      } catch (error: any) {
        console.log(error.message);
      }
    });

    socket.on("Join Round", async (data) => {
      const { roundId, userId, roomName } = data;
      try {
        const joinedRound = await prisma.round.update({
          where: { id: roundId },
          data: {
            users: { connect: { id: userId } },
          },
          include: { users: true },
        });
        if (joinedRound.users.length === 1) {
          const R = getRandomAlphabet();
          this.io.to(roomName).emit("Letter", { letter: R });
        }
      } catch (error: any) {
        console.log(error.message);
      }
    });

    socket.on("Letters From FrontEnd", (data) => {
      this.io.to(data.roomName).emit("Finalized Letters Array", data.data);
    });

    socket.on("Submit Round", async (data) => {
      const { roomName } = data;
      this.io.to(roomName).emit("Force Submit Round");
    });

    socket.on("Force Submit Round Socket", async (data) => {
      const { gamePlace, gameAnimal, gameThing, gameName, userId, roundId, roomName } = data;
      try {
        await UserController.createData(userId, gameName, gamePlace, gameAnimal, gameThing, roundId);
        const sock = await prisma.socketId.findFirst({
          where: { array: { has: socket.id } },
        });
        if (sock && sock.array) {
          let index = sock.array.indexOf(socket.id);
          socket.to(sock.array[(index + 1) % sock.array.length]).emit("Validation", data);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    });

    socket.on("Ready", async (data) => {
      const { roomName } = data;
      this.count[roomName]++;
      try {
        const iin = await this.io.in(roomName).fetchSockets();
        if (this.count[roomName] >= iin.length) {
          this.io.to(roomName).emit("Next Round");
          console.log("emitted Next Round to everonw")
          this.count[roomName] = 0;
        }
      } catch (error: any) {
        console.log(error.message);
      }
    });

    socket.on("Cleanup", async (data) => {
      const { roomName, roundIds } = data;
      try {
        await prisma.data.deleteMany({
          where: {
            roundId: { in: roundIds },
          },
        });
        await prisma.round.deleteMany({
          where: {
            id: { in: roundIds },
          },
        });
        await prisma.room.delete({
          where: { Name: roomName },
        });
      } catch (error: any) {
        console.log(error.message);
      }
    });

    socket.on("Cleanup User", async (data) => {
      const { userId } = data;
       
      try {
        await prisma.data.deleteMany({
            where:{
                userId
            }
        }) 
        await prisma.user.delete({
          where: { id: userId },
        });
      } catch (error: any) {
        console.log(error.message);
      }
    });

    socket.on("disconnect", async () => {
      try {
        const roomId = await UserController.disconnectHandler(socket.id);
        if (roomId == "a") return;
        const roomName = await prisma.room.findFirst({
          where: { id: roomId },
        });
        const username = await prisma.user.findFirst({
          where: { socketId: socket.id },
        });
        this.io.to(roomName ? roomName.Name : " ").emit("Left Room", { username: username?.Name });
      } catch (error: any) {
        console.log(error.message);
      }
    });
  };
}
