import { createServerFn } from "@tanstack/start";
import { PrismaClient, User } from "@prisma/client";

export const getUsers = createServerFn({method: "GET",}).handler(async (context) => {
    const prisma = new PrismaClient
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const users: User[] = await prisma.user.findMany();
    return users;
});
