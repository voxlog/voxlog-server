/*
  Warnings:

  - The primary key for the `Song` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `mbRecordingId` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Song` table. All the data in the column will be lost.
  - You are about to alter the column `songId` on the `Song` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(16)`.
  - Added the required column `songTitle` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Scrobble" DROP CONSTRAINT "Scrobble_songId_fkey";

-- DropIndex
DROP INDEX "Song_mbRecordingId_key";

-- AlterTable
ALTER TABLE "Scrobble" ALTER COLUMN "songId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Song" DROP CONSTRAINT "Song_pkey",
DROP COLUMN "mbRecordingId",
DROP COLUMN "title",
ADD COLUMN     "lastSynced" TIMESTAMP(0),
ADD COLUMN     "songTitle" VARCHAR(100) NOT NULL,
ALTER COLUMN "songId" SET DATA TYPE VARCHAR(16),
ADD CONSTRAINT "Song_pkey" PRIMARY KEY ("songId");

-- AddForeignKey
ALTER TABLE "Scrobble" ADD CONSTRAINT "Scrobble_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("songId") ON DELETE SET NULL ON UPDATE CASCADE;
