import { UseFilters } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  BaseWsExceptionFilter,
} from '@nestjs/websockets';
import * as cookie from 'cookie';
import { Server, Socket } from 'socket.io';

import { AuthService, JwtSign } from '../auth';

@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway({ namespace: 'chat', cookie: true })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  //   @WebSocketServer()
  //   private server!: Server;

  constructor(private auth: AuthService) {}

  @SubscribeMessage('joinRoom')
  public async joinRoom(client: Socket, room: string): Promise<void> {
    await client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  public async leaveRoom(client: Socket, room: string): Promise<void> {
    await client.leave(room);
    client.emit('leftRoom', room);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public afterInit(_server: Server): void {
  }

  public handleDisconnect(client: Socket): void {
    console.log(client.id);

    // return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket): void {
    const cookieData = <Partial<JwtSign>>cookie.parse(client.handshake.headers.cookie || '');

    if (!cookieData.access_token) {
      client.disconnect();
      return;
    }

    const user = this.auth.validateJwtToken(cookieData.access_token);

    if (!user) {
      client.disconnect();
      return;
    }
    client.data['user'] = {
      userId: user.sub,
      username: user.username,
      role: user.role,
    };
  }
}
