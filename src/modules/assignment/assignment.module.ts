import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { UserModule, UserScheduleEntity } from '../user';
import { WebScraperModule } from '../webscraper';
import { ASSIGNMENT_QUEUES } from './assignment.constants';
import { ShowAssignmentsConsumer } from './consumers';
import { ScheduleAssignmentCron } from './cron';
import { AssignmentService } from './services';

@Module({
  imports: [
    BullModule.registerQueue({
      name: ASSIGNMENT_QUEUES.SHOW_ASSIGNMENTS,
    }),
    TypeOrmModule.forFeature([UserScheduleEntity]),
    WebScraperModule,
    UserModule,
  ],
  providers: [AssignmentService, ShowAssignmentsConsumer, ScheduleAssignmentCron],
  exports: [AssignmentService],
})
export class AssignmentModule {}
