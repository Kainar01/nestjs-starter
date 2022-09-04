import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import moment from 'moment-timezone';
import { I18n, I18nService } from 'nestjs-i18n';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import type { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

import { BotContext, MOODLE_BOT_NAME, TELEGRAM_EMOJIES } from '@/modules/bot';
import { UserService } from '@/modules/user';

import { ASSIGNMENT_QUEUES } from '../assignment.constants';
import type { ShowAssignmentJobData } from '../interfaces';
import { AssignmentService } from '../services';

@Processor(ASSIGNMENT_QUEUES.SHOW_ASSIGNMENTS)
export class ShowAssignmentsConsumer {
  constructor(
    @I18n() private i18n: I18nService,
    private userService: UserService,
    private assignmentService: AssignmentService,
    @InjectBot(MOODLE_BOT_NAME)
    private readonly bot: Telegraf<BotContext>,
  ) {}

  @Process()
  public async process(job: Job<ShowAssignmentJobData>) {
    const user = await this.userService.findByUserId(job.data.userId);

    if (!user) throw new Error(`User does not exist by id ${job.data.userId}`);

    try {
      const { assignments, error } = await this.assignmentService.getFormattedAssignments(user);

      if (error) throw new Error(error);

      await this.sendMessage(user.chatId, assignments, { parse_mode: 'Markdown' });

      await this.userService.updateUser(user.id, { lastAssignmentNotification: moment().toDate() });
    } catch (err) {
      const message = this.i18n.translate<string>('assignments.error', { args: { error: (<Error>err).message } });
      await this.sendMessage(user.chatId, message);
    }
  }

  @OnQueueActive()
  public async onActive(job: Job<ShowAssignmentJobData>) {
    const user = await this.userService.findByUserId(job.data.userId);
    if (user) {
      const message = this.i18n.translate<string>('assignments.job.processing');
      await this.sendMessage(user.chatId, `${message} ${TELEGRAM_EMOJIES.PLEASED}`);
    }
  }

  public async sendMessage(chatId: string, message: string, extra?: ExtraReplyMessage) {
    return this.bot.telegram.sendMessage(chatId, message, extra);
  }
}
