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
import { EventsService } from './events.service';
import { parse } from 'cookie';
import { User } from '@/types';

type SocketWithAuth = Socket & { auth: User };

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  // cookie: true,
  // middlware: [AuthGuard],
})
// @UseGuards(JwtAuthGuard)
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly eventsService: EventsService) {}

  async handleConnection(client) {
    const cookies = parse(client.handshake.headers.cookie);
    const payload = await this.eventsService.validateUser(
      cookies['refreshtoken'],
    );
    if (!payload) {
      client.disconnect();
    }
    client.auth = payload;
    console.log(client);
    await this.joinRoom(client, +client.handshake.query.roomID);
  }

  // @UseGuards(AuthGuard)
  @SubscribeMessage('events')
  findAll(
    @MessageBody() data: any,
    @ConnectedSocket() client: SocketWithAuth,
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

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    const roomID = +client.handshake.query.roomID;
    const user = client.auth;
    const message = await this.eventsService.sendMessage(roomID, data, user);
    client.to("room_" + roomID).emit('message', message);
    // const message = await this.eventsService.sendMessage(data, client.handshake.query.token);
  }

  async joinRoom(client: SocketWithAuth, roomID: number) {
    client.join("room_" + roomID);
  }

  async leaveRoom(client: SocketWithAuth, roomID: number) {
    client.leave("room_" + roomID);
  }
}
