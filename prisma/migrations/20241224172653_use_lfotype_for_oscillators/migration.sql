/*
  Warnings:

  - Changed the type of `type` on the `OscillatorSettings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "OscillatorSettings" DROP COLUMN "type",
ADD COLUMN     "type" "LfoType" NOT NULL;
