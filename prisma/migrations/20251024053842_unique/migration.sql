/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Room_Name_key" ON "Room"("Name");
