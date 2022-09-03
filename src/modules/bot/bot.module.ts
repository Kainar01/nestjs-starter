import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { TelegrafModule } from 'nestjs-telegraf';

import { UserModule } from '../user';
import { MOODLE_BOT_NAME } from './bot.constants';
import { BotUpdate } from './bot.update';
import { CourseEntity, TaskEntity } from './entities';
import { sessionMiddleware } from './middlewares/session.middleware';
import { InitScene } from './scenes/init/init.scene';
import { AssignmentService, CourseService, DriverService, MoodleService } from './services';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: MOODLE_BOT_NAME,
      useFactory: async (config: ConfigService) => ({
        token: <string> await config.get('bot.token'),
        middlewares: [sessionMiddleware],
        include: [BotModule],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      CourseEntity, TaskEntity,
    ]),
    UserModule,
  ],
  providers: [BotUpdate, InitScene, CourseService, MoodleService, DriverService, AssignmentService],
  exports: [],
})
export class BotModule {}
