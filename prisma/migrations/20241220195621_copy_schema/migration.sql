-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerType" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "accessTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

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
    "userId" TEXT NOT NULL,

    CONSTRAINT "Patch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "showControls" BOOLEAN NOT NULL,
    "patchId" TEXT NOT NULL,

    CONSTRAINT "AppState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Patch_controllerValuesId_key" ON "Patch"("controllerValuesId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModulationSettings" ADD CONSTRAINT "ModulationSettings_oscillatorId_fkey" FOREIGN KEY ("oscillatorId") REFERENCES "OscillatorSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OscillatorSettings" ADD CONSTRAINT "OscillatorSettings_controlSettingsId_fkey" FOREIGN KEY ("controlSettingsId") REFERENCES "ControlSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LfoSettings" ADD CONSTRAINT "LfoSettings_patchId_fkey" FOREIGN KEY ("patchId") REFERENCES "Patch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patch" ADD CONSTRAINT "Patch_controllerValuesId_fkey" FOREIGN KEY ("controllerValuesId") REFERENCES "ControlSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patch" ADD CONSTRAINT "Patch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppState" ADD CONSTRAINT "AppState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppState" ADD CONSTRAINT "AppState_patchId_fkey" FOREIGN KEY ("patchId") REFERENCES "Patch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
