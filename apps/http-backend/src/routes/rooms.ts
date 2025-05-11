import express, { Router } from 'express';
import { Room } from '../models/Room';
import { User } from '../models/User';
import { RoomParticipant } from '../models/RoomParticipant';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { randomBytes } from 'crypto';

const router: express.Router = express.Router();

// Get all rooms
// @ts-ignore
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const rooms = await Room.findAll({
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'username']
        }
      ]
    });
    
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Create a new room
// @ts-ignore
router.post('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { name, isPrivate } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate access code for private rooms
    let accessCode = null;
    if (isPrivate) {
      accessCode = randomBytes(4).toString('hex');
    }

    // Create new room
    const room = await Room.create({
      name,
      createdById: userId,
      isPrivate: isPrivate || false,
      accessCode
    });

    // Add creator as a participant
    await RoomParticipant.create({
      userId,
      roomId: room.id
    });

    res.status(201).json({
      message: 'Room created successfully',
      room: {
        id: room.id,
        name: room.name,
        isPrivate: room.isPrivate,
        accessCode: room.accessCode,
        createdById: room.createdById
      }
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Get room by ID
// @ts-ignore
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    
    const room = await Room.findByPk(id, {
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'username']
        },
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'username'],
          through: { attributes: [] } // Don't include junction table attributes
        }
      ]
    });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Join a room
// @ts-ignore
router.post('/:id/join', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { accessCode } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Find the room
    const room = await Room.findByPk(id);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    // Check access code for private rooms
    if (room.isPrivate && room.accessCode !== accessCode) {
      return res.status(403).json({ error: 'Invalid access code' });
    }
    
    // Check if user is already a participant
    const existingParticipant = await RoomParticipant.findOne({
      where: { userId, roomId: room.id }
    });
    
    if (existingParticipant) {
      return res.status(400).json({ error: 'User is already a participant in this room' });
    }
    
    // Add user as participant
    await RoomParticipant.create({
      userId,
      roomId: room.id
    });
    
    res.json({ message: 'Joined room successfully' });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

export default router; 