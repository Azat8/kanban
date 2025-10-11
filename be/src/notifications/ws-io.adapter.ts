import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';

export class WsIoAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    // 1. Get the ConfigService instance
    const configService = this.app.get(ConfigService);

    // 2. Read the allowed origins from the environment variable
    const allowedOrigins =
      configService.get<string>('ALLOWED_ORIGINS')?.split(',') || [];

    // 3. Configure Socket.io with dynamic CORS
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: allowedOrigins, // Socket.io accepts an array of strings
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    return server;
  }
}
