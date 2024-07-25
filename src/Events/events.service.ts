import { ChatService } from "@/chat/chat.service";
import { User } from "@/types";
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EventsService implements OnModuleInit {
  private chatService: ChatService;
  private jwtService: JwtService;
  constructor(
    private moduleRef: ModuleRef,
    readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.chatService = this.moduleRef.get(ChatService, { strict: false });
    this.jwtService = this.moduleRef.get(JwtService, { strict: false });
  }

  async sendMessage(roomID: number, message: string, user: User) {
    const res = await this.chatService.sendMessage(roomID, message, user);
    if (res) {
      return res;
    }
    return null;
  }

  async validateUser(token: string) {
    const secret = this.configService.get<string>('JWT_REFRESH_KEY');
    const payload = await this.jwtService.verifyAsync(token, { secret });
    if (payload) {
      return payload;
    }
    return null;
  }
}