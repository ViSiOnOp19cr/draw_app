# Database Schema - Draw App (Neon DB)

## User Table
- `id` (PK): Integer, Auto-increment
- `name`: String, Unique, Not Null
- `email`: String, Unique, Not Null
- `password`: String, Not Null (hashed)
- `createdAt`: Timestamp

## Room Table
- `id` (PK): Integer, Auto-increment
- `name`: String, Not Null
- `createdById` (FK): Integer, Not Null (references User.id)
- `isPrivate`: Boolean, Default: false
- `accessCode`: String, Nullable
- `createdAt`: Timestamp

## RoomParticipant Table (Junction Table)
- `id` (PK): Integer, Auto-increment
- `userId` (FK): Integer, Not Null (references User.id)
- `roomId` (FK): Integer, Not Null (references Room.id)
- `joinedAt`: Timestamp

## Relationships
- User to Room: One-to-Many (User creates many Rooms)
- User to RoomParticipant: One-to-Many (User joins many Rooms)
- Room to RoomParticipant: One-to-Many (Room has many Participants)

## Notes
- Passwords are hashed using bcrypt before saving
- JWT tokens are used for authentication
- Room access codes are generated for private rooms
- Database hosted on Neon DB (serverless PostgreSQL)
- SSL connection is required for Neon DB