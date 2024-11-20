import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

let io: SocketIOServer | null = null;

export const configureSocketIO = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Hoặc giới hạn theo domain của bạn, ví dụ: ['http://localhost:3000']
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    // Lắng nghe các sự kiện từ client
    socket.on('joinArticleRoom', (articleSlug: string) => {
      console.log(`User ${socket.id} joined room: ${articleSlug}`);
      socket.join(articleSlug);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};
