/*
  Warnings:

  - You are about to drop the column `songId` on the `Scrobble` table. All the data in the column will be lost.
  - You are about to drop the column `defaultTopSongsRange` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Song` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Scrobble" DROP CONSTRAINT "Scrobble_songId_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_albumId_fkey";

-- AlterTable
ALTER TABLE "Scrobble" DROP COLUMN "songId",
ADD COLUMN     "trackId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "defaultTopSongsRange",
ADD COLUMN     "defaultTopTracksRange" "DaysRange" NOT NULL DEFAULT 'Week';

-- DropTable
DROP TABLE "Song";

-- CreateTable
CREATE TABLE "Track" (
    "trackId" VARCHAR(16) NOT NULL,
    "albumId" TEXT NOT NULL,
    "trackTitle" VARCHAR(100) NOT NULL,
    "durationInSeconds" INTEGER NOT NULL,
    "coverArtUrl" VARCHAR(256),
    "lastSynced" TIMESTAMP(0),

    CONSTRAINT "Track_pkey" PRIMARY KEY ("trackId")
);

-- AddForeignKey
ALTER TABLE "Scrobble" ADD CONSTRAINT "Scrobble_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("trackId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("albumId") ON DELETE RESTRICT ON UPDATE CASCADE;
