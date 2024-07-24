/*
  Warnings:

  - You are about to drop the column `groupRoomId` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomId]` on the table `GroupRoom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `GroupRoom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_groupRoomId_fkey";

-- DropIndex
DROP INDEX "Room_groupRoomId_key";

-- AlterTable
ALTER TABLE "GroupRoom" ADD COLUMN     "roomId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "groupRoomId";

-- CreateIndex
CREATE UNIQUE INDEX "GroupRoom_roomId_key" ON "GroupRoom"("roomId");

-- AddForeignKey
ALTER TABLE "GroupRoom" ADD CONSTRAINT "GroupRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
