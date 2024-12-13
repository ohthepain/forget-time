// pages/api/users/update.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id, email, password, name } = req.body;
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          email,
          password,
          name,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: `Failed to update user: (${error})` });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
