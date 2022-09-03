import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { I18n, I18nService } from 'nestjs-i18n';
import type { WebDriver } from 'selenium-webdriver';

import type { User } from '@/modules/user';

import { DriverService, MoodleService } from '.';
import { TELEGRAM_EMOJIES } from '../bot.constants';
import type { Assignment, AssignmentListRO, FormattedAssignmentListRO } from '../interfaces';

@Injectable()
export class AssignmentService {
  constructor(
    // private userService: UserService,
    @I18n() private i18n: I18nService,
    private driverService: DriverService,
    private moodle: MoodleService,
  ) {}

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
    const now = moment().toDate();
    const diff = moment(assignment.date).diff(now, 'milliseconds');
    const duration = moment.duration(diff, 'milliseconds');

    const timeLeft = {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
    };

    if (timeLeft.days) {
      return this.i18n.translate<string>('assignments.deadline_with_days', { args: { ...timeLeft } });
    }
    if (timeLeft.hours) {
      return this.i18n.translate<string>('assignments.deadline_with_hours', { args: { ...timeLeft } });
    }
    return this.i18n.translate<string>('assignments.deadline_with_minutes', { args: { ...timeLeft } });
  }
}
