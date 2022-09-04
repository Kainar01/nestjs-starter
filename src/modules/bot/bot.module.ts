import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { AssignmentModule } from '../assignment';
import { UserModule } from '../user';
import { WebScraperModule } from '../webscraper';
import { BotUpdate } from './bot.update';
import { CourseEntity, TaskEntity } from './entities';
import { InitScene } from './scenes/init/init.scene';
import { ScheduleScene } from './scenes/schedule/schedule.scene';
import { CourseService, MoodleBotService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEntity, TaskEntity]),
    UserModule,
    WebScraperModule,
    AssignmentModule,
  ],
  providers: [BotUpdate, InitScene, ScheduleScene, CourseService, MoodleBotService],
  exports: [MoodleBotService],
})
export class BotModule {}
