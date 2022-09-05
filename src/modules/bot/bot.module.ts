import { Module } from '@nestjs/common';

import { AssignmentModule } from '../assignment';
import { UserModule } from '../user';
import { WebScraperModule } from '../webscraper';
import { BotUpdate } from './bot.update';
import { InitScene } from './scenes/init/init.scene';
import { ScheduleScene } from './scenes/schedule/schedule.scene';
import { MoodleBotService } from './services';

@Module({
  imports: [
    UserModule,
    WebScraperModule,
    AssignmentModule,
  ],
  providers: [BotUpdate, InitScene, ScheduleScene, MoodleBotService],
  exports: [MoodleBotService],
})
export class BotModule {}
