-- CreateTable
CREATE TABLE "SocketId" (
    "id" TEXT NOT NULL,
    "roomId" TEXT,
    "array" TEXT[],

    CONSTRAINT "SocketId_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocketId_roomId_key" ON "SocketId"("roomId");

-- AddForeignKey
ALTER TABLE "SocketId" ADD CONSTRAINT "SocketId_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
