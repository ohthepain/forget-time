import { prisma } from "@/prisma";

export async function createPatch(
  userId: string,
  controllerValuesId: string,
  lfoSettings: { frequency: number; type: string }[]
) {
  const patch = await prisma.patch.create({
    data: {
      userId,
      controllerValuesId,
      lfoSettings: {
        create: lfoSettings,
      },
    },
  });
  return patch;
}

export async function getPatches() {
  const patches = await prisma.patch.findMany();
  return patches;
}

export async function getPatchById(patchId: string) {
  const patch = await prisma.patch.findUnique({
    where: { id: patchId },
  });
  return patch;
}

export async function updatePatch(
  patchId: string,
  data: Partial<{ controllerValuesId: string; userId: string }>
) {
  const patch = await prisma.patch.update({
    where: { id: patchId },
    data,
  });
  return patch;
}

export async function deletePatch(patchId: string) {
  const patch = await prisma.patch.delete({
    where: { id: patchId },
  });
  return patch;
}
