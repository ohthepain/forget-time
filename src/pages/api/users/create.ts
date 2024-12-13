// pages/api/users/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, name } = req.body;
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password,
          name,
        },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: `Failed to create user: (${error})` });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
