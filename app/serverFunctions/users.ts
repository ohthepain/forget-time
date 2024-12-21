import { createServerFn } from "@tanstack/start";
import { PrismaClient, User } from "@prisma/client";

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = new PrismaClient();
  const users: User[] = await prisma.user.findMany();
  return users;
});

export const getUser = createServerFn({ method: "GET" })
  .validator((userId: string): string => {
    if (typeof userId !== "string" || userId === null) {
      throw new Error("userId must be a string");
    }
    if (userId.length <= 8) {
      throw new Error("userId must have at least 8 characters");
    }
    return userId;
  })
  .handler(async (context) => {
    const userId = context.data;
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({ where: { id: context.data } });
    return user;
  });
