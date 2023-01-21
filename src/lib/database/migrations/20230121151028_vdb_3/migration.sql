/*
  Warnings:

  - Added the required column `duration` to the `SimpleScrobble` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SimpleScrobble" ADD COLUMN     "duration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "duration" INTEGER NOT NULL;
