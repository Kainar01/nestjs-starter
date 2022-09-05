import { UseFilters, UseGuards } from '@nestjs/common';
import { I18n, I18nService } from 'nestjs-i18n';
import { Update, InjectBot, On, Start, Command, Ctx, Action } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { TelegrafExceptionFilter } from '@/common/filters';
import { AssignmentService, AssignmentStatus } from '@/modules/assignment';

import { User, UserService } from '../user';
import { MOODLE_BOT_ACTIONS, MOODLE_BOT_NAME, MOODLE_BOT_SCENES, TELEGRAM_EMOJIES } from './bot.constants';
import { CtxUser } from './decorators';
import { BotAdminGuard } from './guards';
import { BotCommand, BotContext } from './interfaces';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class BotUpdate {
  constructor(
    @InjectBot(MOODLE_BOT_NAME)
    private readonly bot: Telegraf<BotContext>,
    private userService: UserService,
    private assignmentService: AssignmentService,
    @I18n() private i18n: I18nService,
  ) {
    this.useUserMiddleware();
    this.handleError();
  }

  @Start()
  public async onStart(@Ctx() ctx: BotContext, @CtxUser() user: User) {
    if (!user.password || !user.username) {
      const helloMessage = this.getMessage('bot.hello');
      await ctx.reply(`${helloMessage} ${TELEGRAM_EMOJIES.WINKING}`);

      const setUpCredsMsg = this.getMessage('bot.set-up-credentials');
      await ctx.reply(`${setUpCredsMsg} ${TELEGRAM_EMOJIES.PLEASED}`);

      const credsCautionsMsg = this.getMessage('bot.credentials-cautions');
      await ctx.reply(`${credsCautionsMsg} ${TELEGRAM_EMOJIES.HALO}`);

      await ctx.scene.enter(MOODLE_BOT_SCENES.INIT);
    } else {
      const message = this.getMessage('bot.wish');
      await ctx.reply(`${message} ${TELEGRAM_EMOJIES.HALO}`);
    }
  }

  @Command('admin')
  @UseGuards(BotAdminGuard)
  public onAdminCommand(): string {
    return 'Welcome judge';
  }

  @Command(BotCommand.INIT)
  public async onInitCommand(@Ctx() ctx: BotContext): Promise<void> {
    await ctx.scene.enter(MOODLE_BOT_SCENES.INIT);
  }

  @Command(BotCommand.ASSIGNMENTS)
  public async onAssignmentsCommand(@CtxUser() user: User): Promise<string | void> {
    const { error } = this.assignmentService.validateUserLastNotification(user);

    if (error) return `${error} ${TELEGRAM_EMOJIES.FOLDED_HANDS}`;

    await this.assignmentService.scheduleAssignmentNotification(user);

    const message = this.getMessage('assignments.job.scheduled');
    return `${message} ${TELEGRAM_EMOJIES.HALO}`;
  }

  @Command(BotCommand.SCHEDULE)
  public async onScheduleCommand(@Ctx() ctx: BotContext): Promise<string | void> {
    await ctx.scene.enter(MOODLE_BOT_SCENES.SCHEDULE);
  }

  @Command(BotCommand.NOTIFY_ASSIGNMENT)
  public async onNotifyAssignmentCommand(@Ctx() ctx: BotContext): Promise<string | void> {
    await ctx.scene.enter(MOODLE_BOT_SCENES.NOTIFY_ASSIGNMENT);
  }

  @Action(new RegExp(`${MOODLE_BOT_ACTIONS.ASSIGNMENT_SUBMIT}\\d`))
  public async onAssignmentSubmittedAction(@Ctx() ctx: BotContext): Promise<void> {
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });

    const actionData = this.getCallbackData(ctx);
    const assignmentId = Number(actionData.replace(MOODLE_BOT_ACTIONS.ASSIGNMENT_SUBMIT, ''));

    const { title } = await this.assignmentService.updateAssignment(assignmentId, { status: AssignmentStatus.SUBMITTED });

    const msg = this.getMessage('assignments.submitted-assignment', { title });
    await ctx.reply(`${msg}, ${TELEGRAM_EMOJIES.HALO}`, { parse_mode: 'Markdown' });
  }

  @Action(new RegExp(`${MOODLE_BOT_ACTIONS.ASSIGNMENT_HIDE}\\d`))
  public async onAssignmentHideAction(@Ctx() ctx: BotContext): Promise<void> {
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });

    const actionData = this.getCallbackData(ctx);
    const assignmentId = Number(actionData.replace(MOODLE_BOT_ACTIONS.ASSIGNMENT_HIDE, ''));

    const { title } = await this.assignmentService.updateAssignment(assignmentId, { status: AssignmentStatus.HIDDEN });

    const msg = this.getMessage('assignments.hid-assignment', { title });
    await ctx.reply(`${msg}, ${TELEGRAM_EMOJIES.HALO}`, { parse_mode: 'Markdown' });
  }

  @Action(new RegExp(`${MOODLE_BOT_ACTIONS.ASSIGNMENT_NOTIFY_OPTIONS}\\d`))
  public async onAssignmentNotifyAction(@Ctx() ctx: BotContext): Promise<void> {
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });

    const actionData = this.getCallbackData(ctx);
    const assignmentId = Number(actionData.replace(MOODLE_BOT_ACTIONS.ASSIGNMENT_NOTIFY_OPTIONS, ''));

    await ctx.scene.enter(MOODLE_BOT_SCENES.NOTIFY_ASSIGNMENT, { assignmentId });
  }

  @On('text')
  public onMessage(): string {
    const message = this.getMessage('bot.wish');
    return `${message} ${TELEGRAM_EMOJIES.HALO}`;
  }

  private useUserMiddleware(): void {
    const userMiddleware = async (ctx: BotContext, next: () => Promise<void>): Promise<void> => {
      try {
        const me = await this.bot.telegram.getMe();
        const chatId = ctx?.chat?.id;
        if (chatId) {
          let user = await this.userService.findByChatId(chatId.toString());

          if (!user) user = await this.userService.createUser({ chatId: chatId.toString(), name: me.first_name });

          ctx.user = user;
        }
      } catch (err) {
        console.error(err);
      } finally {
        await next();
      }
    };

    this.bot.use(userMiddleware);
  }

  private handleError(): void {
    this.bot.catch((err: any) => console.error(err));
  }

  private getMessage<T = string>(key: string, args?: Record<string, any>) {
    return this.i18n.translate<T>(key, { args });
  }

  private getCallbackData(ctx: BotContext) {
    return <string>ctx.callbackQuery!.data;
  }
}
