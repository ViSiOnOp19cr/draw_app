import { prisma } from "@repo/db";
import express, { Request, Response } from "express";

const router: express.Router = express.Router();

router.post('/rooms', async (req: Request, res: Response) => {
  const { name } = req.body;
  const room = await prisma.Room.create({
    data: { name }
  });
  res.json(room);
});

router.get('/rooms', async (req: Request, res: Response) => {
  const rooms = await prisma.Room.findMany();
  res.json(rooms);
});

export default router;