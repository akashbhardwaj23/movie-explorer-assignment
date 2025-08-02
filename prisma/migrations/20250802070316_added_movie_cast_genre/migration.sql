-- CreateTable
CREATE TABLE "public"."Movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "releaseDate" TIMESTAMP(3),
    "popularity" DOUBLE PRECISION,
    "voteAverage" DOUBLE PRECISION,
    "voteCount" INTEGER,
    "revenue" INTEGER,
    "runtime" INTEGER,
    "posterPath" TEXT,
    "backdropPath" TEXT,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cast" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "characters" TEXT,
    "profilePath" TEXT,

    CONSTRAINT "Cast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MovieGenres" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_MovieCast" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieCast_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MovieGenres_B_index" ON "public"."_MovieGenres"("B");

-- CreateIndex
CREATE INDEX "_MovieCast_B_index" ON "public"."_MovieCast"("B");

-- AddForeignKey
ALTER TABLE "public"."_MovieGenres" ADD CONSTRAINT "_MovieGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MovieGenres" ADD CONSTRAINT "_MovieGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MovieCast" ADD CONSTRAINT "_MovieCast_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Cast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MovieCast" ADD CONSTRAINT "_MovieCast_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
