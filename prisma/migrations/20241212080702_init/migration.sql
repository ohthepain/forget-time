-- CreateTable
CREATE TABLE "ModulationSettings" (
    "id" TEXT NOT NULL,
    "lfoId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "oscillatorId" TEXT NOT NULL,

    CONSTRAINT "ModulationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OscillatorSettings" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "controllers" DOUBLE PRECISION[],
    "controlSettingsId" TEXT NOT NULL,

    CONSTRAINT "OscillatorSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlSettings" (
    "id" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ControlSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LfoSettings" (
    "id" TEXT NOT NULL,
    "frequency" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "patchId" TEXT NOT NULL,

    CONSTRAINT "LfoSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patch" (
    "id" TEXT NOT NULL,
    "controllerValuesId" TEXT NOT NULL,

    CONSTRAINT "Patch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppState" (
    "id" TEXT NOT NULL,
    "showControls" BOOLEAN NOT NULL,
    "patchId" TEXT NOT NULL,

    CONSTRAINT "AppState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patch_controllerValuesId_key" ON "Patch"("controllerValuesId");

-- AddForeignKey
ALTER TABLE "ModulationSettings" ADD CONSTRAINT "ModulationSettings_oscillatorId_fkey" FOREIGN KEY ("oscillatorId") REFERENCES "OscillatorSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OscillatorSettings" ADD CONSTRAINT "OscillatorSettings_controlSettingsId_fkey" FOREIGN KEY ("controlSettingsId") REFERENCES "ControlSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LfoSettings" ADD CONSTRAINT "LfoSettings_patchId_fkey" FOREIGN KEY ("patchId") REFERENCES "Patch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patch" ADD CONSTRAINT "Patch_controllerValuesId_fkey" FOREIGN KEY ("controllerValuesId") REFERENCES "ControlSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppState" ADD CONSTRAINT "AppState_patchId_fkey" FOREIGN KEY ("patchId") REFERENCES "Patch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
