import { createServerFn } from "@tanstack/start";
import { redirect } from "@tanstack/react-router";
import { PrismaClient, User } from "@prisma/client";
import { hashPassword } from "../utils/prisma";
import { useAppSession } from "../utils/session";

export const signupFn = createServerFn()
  .validator(
    (d) =>
      d as {
        email: string;
        password: string;
        redirectUrl?: string;
      }
  )
  .handler(async ({ data }) => {
    const prismaClient = new PrismaClient();

    // Check if the user already exists
    const found = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });

    // Encrypt the password using Sha256 into plaintext
    const password = await hashPassword(data.password);

    // Create a session
    const session = await useAppSession();

    if (found) {
      if (found.password !== password) {
        return {
          error: true,
          userExists: true,
          message: "User already exists",
        };
      }

      // Store the user's email in the session
      await session.update({
        userEmail: found.email,
      });

      // Redirect to the prev page stored in the "redirect" search param
      throw redirect({
        href: data.redirectUrl || "/",
      });
    }

    // Create the user
    const user = await prismaClient.user.create({
      data: {
        email: data.email,
        password,
      },
    });

    // Store the user's email in the session
    await session.update({
      userEmail: user.email,
    });

    // Redirect to the prev page stored in the "redirect" search param
    throw redirect({
      href: data.redirectUrl || "/",
    });
  });

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

export const deleteUser = createServerFn({ method: "POST" })
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
    const user = await prisma.user.delete({ where: { id: context.data } });
    return user;
  });
