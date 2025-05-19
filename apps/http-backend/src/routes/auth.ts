import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { Op } from 'sequelize';
import { SignUpSchema, SignInSchema } from '@repo/common';

const router: express.Router = express.Router();

// Sign up route
//@ts-ignore
router.post('/signup', async (req: Request, res: Response) => {
  try {
      const { email, password, name } = SignUpSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }] 
      } 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name
    });

    // Generate JWT token
    const token = generateToken({ 
      id: user.id, 
      email: user.email 
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Sign in route
// @ts-ignore
router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = SignInSchema.parse(req.body);

    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken({ 
      id: user.id, 
      email: user.email 
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error in signin:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router; 