/*
  Warnings:

  - Changed the type of `lfoId` on the `ModulationSettings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LfoType" AS ENUM ('SINE', 'SQUARE', 'TRIANGLE', 'SAWTOOTH');

-- CreateEnum
CREATE TYPE "OscillatorType" AS ENUM ('CUSTOM', 'SINE', 'SQUARE', 'TRIANGLE', 'SAWTOOTH');

-- AlterTable
ALTER TABLE "ModulationSettings" DROP COLUMN "lfoId",
ADD COLUMN     "lfoId" "LfoType" NOT NULL;
