import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly configService: ConfigService) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token) return client.disconnect(true);

    try {
      const payload = jwt.verify(
        token,
        this.configService.get<string>('JWT_SECRET')!,
      ) as { id: number; iat: number; exp: number };

      if (typeof payload === 'object' && 'id' in payload) {
        client.data.userId = payload.id;
        client.join(String(payload.id));
      } else {
        client.disconnect(true);
      }
    } catch (err) {
      console.error('JWT verification failed:', err);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  sendTaskNotification(userId: string, message: string) {
    this.server.to(userId).emit('taskNotification', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ) {
    if (client.data.userId === userId) {
      client.join(userId);
    }
  }
}
