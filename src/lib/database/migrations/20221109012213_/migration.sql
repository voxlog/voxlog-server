/*
  Warnings:

  - You are about to drop the column `artUrl` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `artUrl` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Song` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mbArtistId]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mbRecordingId]` on the table `Song` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coverArtUrl` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationInSeconds` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "artUrl",
DROP COLUMN "createdAt",
ADD COLUMN     "coverArtUrl" VARCHAR(256) NOT NULL,
ALTER COLUMN "mbReleaseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "artUrl",
DROP COLUMN "createdAt",
DROP COLUMN "duration",
ADD COLUMN     "coverArtUrl" VARCHAR(256),
ADD COLUMN     "durationInSeconds" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Artist_mbArtistId_key" ON "Artist"("mbArtistId");

-- CreateIndex
CREATE UNIQUE INDEX "Song_mbRecordingId_key" ON "Song"("mbRecordingId");
