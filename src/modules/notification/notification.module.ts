import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { AssignmentModule } from '../assignment';
import { UserModule } from '../user';
import { WebScraperModule } from '../webscraper';
import { NOTIFICATION_QUEUES } from './constants';
import { AssignmentNotificationConsumer } from './consumers';
import { NotificationService } from './services';

@Module({
  imports: [
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUES.NOTIFY_ASSIGNMENT,
    }),
    // TypeOrmModule.forFeature([]),
    WebScraperModule,
    UserModule,
    AssignmentModule,
  ],
  providers: [NotificationService, AssignmentNotificationConsumer],
  exports: [NotificationService],
})
export class NotificationModule {}
