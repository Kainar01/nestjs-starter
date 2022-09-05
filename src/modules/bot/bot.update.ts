import { UseFilters, UseGuards } from '@nestjs/common';
import { I18n, I18nService } from 'nestjs-i18n';
import { Update, InjectBot, On, Start, Command, Ctx } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { TelegrafExceptionFilter } from '@/common/filters';
import { AssignmentService } from '@/modules/assignment';

import { User, UserService } from '../user';
import { MOODLE_BOT_NAME, MOODLE_BOT_SCENES, TELEGRAM_EMOJIES } from './bot.constants';
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
}
