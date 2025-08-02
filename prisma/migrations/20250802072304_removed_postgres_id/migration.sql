/*
  Warnings:

  - The primary key for the `Movie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_MovieCast` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_MovieGenres` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Movie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_MovieCast` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_MovieGenres` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."_MovieCast" DROP CONSTRAINT "_MovieCast_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_MovieGenres" DROP CONSTRAINT "_MovieGenres_B_fkey";

-- AlterTable
ALTER TABLE "public"."Cast" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Cast_id_seq";

-- AlterTable
ALTER TABLE "public"."Genre" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Genre_id_seq";

-- AlterTable
ALTER TABLE "public"."Movie" DROP CONSTRAINT "Movie_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Movie_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."_MovieCast" DROP CONSTRAINT "_MovieCast_AB_pkey",
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL,
ADD CONSTRAINT "_MovieCast_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "public"."_MovieGenres" DROP CONSTRAINT "_MovieGenres_AB_pkey",
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL,
ADD CONSTRAINT "_MovieGenres_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateIndex
CREATE INDEX "_MovieCast_B_index" ON "public"."_MovieCast"("B");

-- CreateIndex
CREATE INDEX "_MovieGenres_B_index" ON "public"."_MovieGenres"("B");

-- AddForeignKey
ALTER TABLE "public"."_MovieGenres" ADD CONSTRAINT "_MovieGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MovieCast" ADD CONSTRAINT "_MovieCast_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
