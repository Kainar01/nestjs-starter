import { Module } from '@nestjs/common';

import { AuthModule } from '../auth';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    AuthModule,
  ],
  providers: [ChatGateway],
  exports: [],
})
export class ChatModule {}
