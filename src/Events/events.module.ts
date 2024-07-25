import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { ChatModule } from '@/chat/chat.module';
import { AuthModule } from '@/auth';

@Module({
  imports: [ChatModule, AuthModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
