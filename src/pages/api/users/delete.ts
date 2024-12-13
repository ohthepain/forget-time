// pages/api/users/delete.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.body;
    try {
      const user = await prisma.user.delete({
        where: { id },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: `Failed to delete user: (${error})` });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
