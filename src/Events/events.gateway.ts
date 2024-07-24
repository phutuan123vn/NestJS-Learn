import { JwtAuthGuard } from '@/auth';
import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from './websocket.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
// @UseGuards(JwtAuthGuard)
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client) {
    // console.log('client connected', client);
    if (client.handshake.query || client.handshake.query.token) {
      console.log('client connected with token', client.handshake.query);
      console.log('client handshake', client.handshake);
    }
    if (Object.keys(client.handshake.auth).length === 0) {
      client.disconnect();
    }
  }
  
  @UseGuards(AuthGuard)
  @SubscribeMessage('events')
  findAll(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Observable<WsResponse<number>> {
    console.log(client);
    console.log(data);
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
