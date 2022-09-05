import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bull';
import moment from 'moment-timezone';
import { I18n, I18nService } from 'nestjs-i18n';

import { AssignmentService } from '@/modules/assignment';

import { NOTIFICATION_QUEUES } from '../constants';
import type { NotifyAssignmentJobData } from '../interfaces';

@Injectable()
export class NotificationService {
  constructor(
    @I18n() private i18n: I18nService,

    private assignmentService: AssignmentService,
    @InjectQueue(NOTIFICATION_QUEUES.NOTIFY_ASSIGNMENT) private notifyAssignmentQueue: Queue<NotifyAssignmentJobData>,
  ) {}

  public async scheduleAssignmentNotificationJob(data: NotifyAssignmentJobData, hours: number) {
    const assignment = await this.assignmentService.getAssignmentById(data.assignmentId);
    if (!assignment) {
      throw new Error('Notification does not exist');
    }

    const delay = this.countNotificationTimeLeft(hours, assignment.deadline);

    return this.notifyAssignmentQueue.add(data, { delay });
  }

  public countNotificationTimeLeft(hours: number, deadline: Date, unitOfTime: moment.unitOfTime.Diff = 'milliseconds') {
    // notification time calculate
    const notificationDateTime = moment(deadline).subtract(hours, 'hours');
    const now = moment();

    // if it is in the past
    if (notificationDateTime.isBefore(now)) {
      throw new Error(this.i18n.translate('notification.not-valid-hour'));
    }

    return notificationDateTime.diff(now, unitOfTime);
  }
}
