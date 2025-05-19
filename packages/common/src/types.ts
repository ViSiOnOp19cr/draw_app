import {z} from 'zod';

export const User = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
});

export const SignUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string(),
});

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20),
});


