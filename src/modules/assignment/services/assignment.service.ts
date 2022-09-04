import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bull';
import moment from 'moment-timezone';
import { I18n, I18nService } from 'nestjs-i18n';
import type { WebDriver } from 'selenium-webdriver';

import { TELEGRAM_EMOJIES } from '@/modules/bot';
import { User, UserService } from '@/modules/user';
import { DriverService, MoodleService } from '@/modules/webscraper';

import {
  ASSIGNMENT_NOTIFICATION_COOLDOWN_MILLISECONDS,
  ASSIGNMENT_QUEUES,
  ASSIGNMENT_REQUEST_COOLDOWN_MILLISECONDS,
} from '../assignment.constants';
import type { Assignment, AssignmentListRO, FormattedAssignmentListRO } from '../assignment.interface';
import type { ShowAssignmentJobData } from '../interfaces';

@Injectable()
export class AssignmentService {
  constructor(
    @I18n() private i18n: I18nService,
    private driverService: DriverService,
    private moodle: MoodleService,
    private userService: UserService,
    @InjectQueue(ASSIGNMENT_QUEUES.SHOW_ASSIGNMENTS) private showAssignmentQueue: Queue<ShowAssignmentJobData>,
  ) {}

  public async scheduleAssignmentNotification(user: User, delay?: number) {
    await this.showAssignmentQueue.add({ userId: user.id }, { delay });
    await this.userService.updateUser(user.id, { lastAssignmentRequest: moment().toDate() });
  }

  public validateUserLastNotification({ lastAssignmentNotification, lastAssignmentRequest }: User) {
    if (lastAssignmentNotification || lastAssignmentRequest) {
      if (lastAssignmentRequest) {
        const { error } = this.getCooldownMessage(
          lastAssignmentRequest,
          ASSIGNMENT_REQUEST_COOLDOWN_MILLISECONDS,
          'assignments.job.too-many-requests',
        );

        if (error) {
          return { error };
        }
      }

      if (lastAssignmentNotification) {
        const { error } = this.getCooldownMessage(
          lastAssignmentNotification,
          ASSIGNMENT_NOTIFICATION_COOLDOWN_MILLISECONDS,
          'assignments.cooldown-wait',
        );

        if (error) {
          return { error };
        }
      }
    }

    return { error: null };
  }

  public async isValidCreds(username: string, password: string) {
    return this.driverService.withDriver(async (driver: WebDriver) => this.moodle.checkLogin(username, password, driver));
  }

  public async getAssignments({ username, password }: User): Promise<AssignmentListRO> {
    return this.driverService.withDriver(async (driver: WebDriver) => this.moodle.getUpcomingEvents(username!, password!, driver));
  }

  public async getFormattedAssignments(user: User): Promise<FormattedAssignmentListRO> {
    const { events, error } = await this.getAssignments(user);

    let assignments = '';
    // get this week's assignments
    const filteredEvents = (events || []).filter((e: Assignment) => moment(e.date).diff(moment(new Date()), 'days') <= 7);

    for (const event of filteredEvents) {
      // TITLE
      assignments += `${event.title.toLowerCase().includes('quiz') ? TELEGRAM_EMOJIES.EXCLAMATION : ''} *${event.title}*\n\n`;
      // DEADLINE DATE
      assignments += `${TELEGRAM_EMOJIES.CALENDAR} ${moment(event.date).format('dddd, MMMM Do YYYY, h:mm a')}\n\n`;
      // TIME LEFT
      assignments += `${TELEGRAM_EMOJIES.CLOCK} ${this.getDeadline(event)}\n\n`;
      // LINK
      assignments += `${TELEGRAM_EMOJIES.LINK} ${event.link}\n\n`;
      // COURSE NAME
      assignments += `${TELEGRAM_EMOJIES.LEDGER} ${event.courseTitle}\n\n`;
    }

    return { error, assignments };
  }

  private getDeadline(assignment: Assignment) {
    const now = moment();

    const timeLeft = this.getTimeLeft(now, assignment.date);

    if (timeLeft.days) {
      return this.i18n.translate<string>('assignments.deadline_with_days', { args: { ...timeLeft } });
    }
    if (timeLeft.hours) {
      return this.i18n.translate<string>('assignments.deadline_with_hours', { args: { ...timeLeft } });
    }
    return this.i18n.translate<string>('assignments.deadline_with_minutes', { args: { ...timeLeft } });
  }

  private getTimeLeft(from: Date | moment.Moment, to: Date | moment.Moment) {
    const now = moment(from);
    const diff = moment(to).diff(now, 'milliseconds');
    const duration = moment.duration(diff, 'milliseconds');

    return {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  }

  private getCooldownCountdown(from: Date | moment.Moment, to: Date | moment.Moment) {
    const args = this.getTimeLeft(from, to);

    const timeLeftMsgKey = args.minutes ? 'assignments.cooldown-minutes' : 'assignments.cooldown-seconds';
    return this.i18n.translate<string>(timeLeftMsgKey, { args });
  }

  private getCooldownMessage(lastRequest: Date | moment.Moment, cooldownInMilliseconds: number, msgKey: string) {
    const now = moment();

    const lastRequestDate = moment(lastRequest);
    // next date when request is available again
    const allowedRequestDate = lastRequestDate.clone().add(cooldownInMilliseconds, 'milliseconds');

    if (allowedRequestDate.isAfter(now)) {
      // get left time until next request allowed date
      const left = this.getCooldownCountdown(now, allowedRequestDate);

      const errMsg = this.i18n.translate<string>(msgKey, { args: { left } });

      return { error: errMsg };
    }
    return { error: null };
  }
}
