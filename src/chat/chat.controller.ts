import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from '@/types';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService
    ){}

    @Get(':id')
    async getChat(@Param('id') roomID: number) {
        return await this.chatService.getChat(roomID);
    }

    @Post('create')
    async createRoom(@Req() req: Request, @Body() Body){
        const user = req.user
        return await this.chatService.createRoom(Body.roomName, user);
    }

}
