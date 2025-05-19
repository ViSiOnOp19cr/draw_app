
import { PrismaClient } from "@prisma/client/scripts/default-index.js";

export const prisma = new PrismaClient();

export * from '@prisma/client';