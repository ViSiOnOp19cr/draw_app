import { WebSocketServer, WebSocket } from "ws";
import { parse } from "url";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'draw-app-secret-key';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  username?: string;
  roomId?: string;
}

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws: AuthenticatedWebSocket, req) => {
  console.log("Client connected");
  
  // Parse URL parameters for token and roomId
  const { query } = parse(req.url || "", true);
  const token = query.token as string;
  const roomId = query.roomId as string;
  
  if (!token) {
    ws.close(4001, "Authentication token is required");
    return;
  }
  
  // Verify JWT token
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    ws.userId = decoded.id;
    ws.username = decoded.username;
    ws.roomId = roomId;
    
    console.log(`Authenticated user: ${decoded.username} (${decoded.id})`);
    console.log(`Connected to room: ${roomId}`);
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: "connection_established",
      data: {
        userId: decoded.id,
        username: decoded.username,
        roomId: roomId
      }
    }));
  } catch (error) {
    console.error("Invalid token:", error);
    ws.close(4002, "Invalid authentication token");
    return;
  }
  
  // Message handler
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log(`Received message from ${ws.username}:`, message);
      
      // Add user info to message
      const enrichedMessage = {
        ...message,
        sender: {
          id: ws.userId,
          username: ws.username
        },
        roomId: ws.roomId,
        timestamp: new Date().toISOString()
      };
      
      // Broadcast to all clients in the same room
      wss.clients.forEach((client) => {
        const typedClient = client as AuthenticatedWebSocket;
        if (typedClient.roomId === ws.roomId && typedClient !== ws && typedClient.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(enrichedMessage));
        }
      });
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });
  
  ws.on("close", () => {
    console.log(`Client disconnected: ${ws.username} (${ws.userId})`);
  });
});
