import { prisma } from "@/prisma";

export async function createUser(
  email: string,
  password: string,
  name?: string
) {
  const user = await prisma.user.create({
    data: {
      email,
      password,
      name,
    },
  });
  return user;
}

export async function getUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
}

export async function updateUser(
  userId: string,
  data: Partial<{ email: string; password: string; name: string }>
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return user;
}

export async function deleteUser(userId: string) {
  const user = await prisma.user.delete({
    where: { id: userId },
  });
  return user;
}
