/*
  Warnings:

  - You are about to drop the column `Animal` on the `Round` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Round` table. All the data in the column will be lost.
  - You are about to drop the column `Place` on the `Round` table. All the data in the column will be lost.
  - You are about to drop the column `Thing` on the `Round` table. All the data in the column will be lost.
  - You are about to drop the `_RoomToRound` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roomId` to the `Round` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_RoomToRound" DROP CONSTRAINT "_RoomToRound_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_RoomToRound" DROP CONSTRAINT "_RoomToRound_B_fkey";

-- AlterTable
ALTER TABLE "Round" DROP COLUMN "Animal",
DROP COLUMN "Name",
DROP COLUMN "Place",
DROP COLUMN "Thing",
ADD COLUMN     "roomId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."_RoomToRound";

-- CreateTable
CREATE TABLE "Data" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "roundId" TEXT,
    "gameName" TEXT NOT NULL,
    "gamePlace" TEXT NOT NULL,
    "gameAnimal" TEXT NOT NULL,
    "gameThing" TEXT NOT NULL,
    "gameScore" INTEGER DEFAULT 5,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Data" ADD CONSTRAINT "Data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Data" ADD CONSTRAINT "Data_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE SET NULL ON UPDATE CASCADE;
