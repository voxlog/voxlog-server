-- CreateEnum
CREATE TYPE "RangePreference" AS ENUM ('Week', 'Month', 'Quarter', 'HalfYear', 'Year', 'AllTime');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "username" VARCHAR(16) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "birthDate" DATE NOT NULL,
    "password" CHAR(60) NOT NULL,
    "bio" VARCHAR(140),
    "realName" VARCHAR(128),
    "profilePictureUrl" VARCHAR(2048),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "artistsRange" "RangePreference" NOT NULL DEFAULT 'AllTime',
    "albumsRange" "RangePreference" NOT NULL DEFAULT 'AllTime',
    "tracksRange" "RangePreference" NOT NULL DEFAULT 'AllTime',

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Artist" (
    "artistId" TEXT NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "picUrl" VARCHAR(2048),
    "mbId" VARCHAR(36),
    "spId" VARCHAR(22),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("artistId")
);

-- CreateTable
CREATE TABLE "Album" (
    "albumId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "title" VARCHAR(512) NOT NULL,
    "coverArtUrl" VARCHAR(2048),
    "mbId" VARCHAR(36),
    "spId" VARCHAR(22),

    CONSTRAINT "Album_pkey" PRIMARY KEY ("albumId")
);

-- CreateTable
CREATE TABLE "Track" (
    "trackId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "title" VARCHAR(512) NOT NULL,
    "spId" VARCHAR(22),
    "mbId" VARCHAR(36),

    CONSTRAINT "Track_pkey" PRIMARY KEY ("trackId")
);

-- CreateTable
CREATE TABLE "Scrobble" (
    "scrobbleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "Scrobble_pkey" PRIMARY KEY ("scrobbleId")
);

-- CreateTable
CREATE TABLE "SimpleScrobble" (
    "scrobbleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trackTitle" VARCHAR(512) NOT NULL,
    "artistName" VARCHAR(256) NOT NULL,

    CONSTRAINT "SimpleScrobble_pkey" PRIMARY KEY ("scrobbleId")
);

-- CreateTable
CREATE TABLE "Event" (
    "eventId" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" VARCHAR(2048) NOT NULL,
    "url" VARCHAR(2048),
    "imageUrl" VARCHAR(2048),
    "lat" REAL NOT NULL,
    "lon" REAL NOT NULL,
    "startTime" TIMESTAMP(0) NOT NULL,
    "endTime" TIMESTAMP(0) NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "EventAttendee" (
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventAttendee_pkey" PRIMARY KEY ("eventId","userId")
);

-- CreateTable
CREATE TABLE "EventArtist" (
    "eventId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventArtist_pkey" PRIMARY KEY ("eventId","artistId")
);

-- CreateTable
CREATE TABLE "EventPicture" (
    "pictureId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "description" VARCHAR(256),
    "uploaderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventPicture_pkey" PRIMARY KEY ("pictureId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_mbId_key" ON "Artist"("mbId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_spId_key" ON "Artist"("spId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_mbId_key" ON "Album"("mbId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_spId_key" ON "Album"("spId");

-- CreateIndex
CREATE UNIQUE INDEX "Track_spId_key" ON "Track"("spId");

-- CreateIndex
CREATE UNIQUE INDEX "Track_mbId_key" ON "Track"("mbId");

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("albumId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scrobble" ADD CONSTRAINT "Scrobble_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scrobble" ADD CONSTRAINT "Scrobble_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("trackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimpleScrobble" ADD CONSTRAINT "SimpleScrobble_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventArtist" ADD CONSTRAINT "EventArtist_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventArtist" ADD CONSTRAINT "EventArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPicture" ADD CONSTRAINT "EventPicture_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPicture" ADD CONSTRAINT "EventPicture_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
