import { UseFilters, UseGuards } from '@nestjs/common';
import { I18n, I18nService } from 'nestjs-i18n';
import { Update, InjectBot, On, Start, Command, Ctx, Message } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { TelegrafExceptionFilter } from '@/common/filters';

import { User, UserService } from '../user';
import { MOODLE_BOT_NAME, MOODLE_BOT_SCENES, TELEGRAM_EMOJIES } from './bot.constants';
import { CtxUser } from './decorators';
import { BotAdminGuard } from './guards';
import type { BotContext } from './interfaces';
import { AssignmentService } from './services';

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

  @Command('init')
  public async onInitCommand(@Ctx() ctx: BotContext): Promise<void> {
    await ctx.scene.enter(MOODLE_BOT_SCENES.INIT);
  }

  @Command('assignments')
  public async onAssignmentsCommand(@Ctx() ctx: BotContext, @CtxUser() user: User): Promise<string | void> {
    const { assignments, error } = await this.assignmentService.getFormattedAssignments(user);

    if (error) {
      return this.getMessage('assignments.error', { error });
    }

    await ctx.reply(assignments, { parse_mode: 'Markdown' });
  }

  @On('text')
  public onMessage(@Message('text') text: string): string {
    return `message from root scene ${text}`;
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
