import { UseFilters, UseGuards } from '@nestjs/common';
import { Update, InjectBot, On, Start, Command, Ctx, Message } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { TelegrafExceptionFilter } from '@/common/filters';

import { UserService } from '../user';
import { MOODLE_BOT_NAME, MOODLE_BOT_SCENES } from './bot.constants';
import { BotAdminGuard } from './guards';
import type { BotContext } from './interfaces';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class BotUpdate {
  constructor(
    @InjectBot(MOODLE_BOT_NAME)
    private readonly bot: Telegraf<BotContext>,
    private userService: UserService,
  ) {
    this.useUserMiddleware();
  }

  @Start()
  public onStart(): string {
    return 'Say hello to me';
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
}
