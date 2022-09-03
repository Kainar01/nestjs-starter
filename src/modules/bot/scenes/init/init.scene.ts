import { Action, Ctx, Message, Next, Wizard, WizardStep } from 'nestjs-telegraf';
import type { Scenes } from 'telegraf';

import { User, UserService } from '@/modules/user';

import { MOODLE_BOT_SCENES } from '../../bot.constants';
import { CtxUser } from '../../decorators';
import { BotInitActions } from '../../interfaces';
import { INIT_STEPS } from './init.constants';

@Wizard(MOODLE_BOT_SCENES.INIT)
export class InitScene {
  constructor(private userService: UserService) {}

  @WizardStep(INIT_STEPS.USERNAME)
  public async enterUsername(@Ctx() ctx: Scenes.WizardContext, @CtxUser() user: User): Promise<void> {
    if (user.username) {
      await ctx.reply(`Ваш старый логин: *${user.username}*\n\nХотите поменять?`, {
        reply_markup: {
          remove_keyboard: true,
          one_time_keyboard: true,
          inline_keyboard: [
            [{ text: 'Да', callback_data: BotInitActions.USERNAME_CHANGE }],
            [{ text: 'Нет', callback_data: BotInitActions.USERNAME_SKIP }],
          ],
        },
        parse_mode: 'MarkdownV2',
      });
    } else {
      await ctx.reply('Введите новый логин');
      ctx.wizard.next();
    }
  }

  @WizardStep(INIT_STEPS.PASSWORD)
  public async enterPassword(
    @Ctx() ctx: Scenes.WizardContext,
      @CtxUser() user: User,
      @Message('text') username: string,
      @Next() next: () => Promise<void>,
  ): Promise<void> {
    if (!this.isUsernameValid(username)) {
      await ctx.reply('Логин может только соддержать буквы и цифры');
      // set username step
      await this.runStep(ctx, next, INIT_STEPS.USERNAME);
    } else {
      if (user.password) {
        await ctx.reply('Хотите заменить старый пароль?', {
          reply_markup: {
            remove_keyboard: true,
            one_time_keyboard: true,
            inline_keyboard: [
              [{ text: 'Да', callback_data: BotInitActions.PASSWORD_CHANGE }],
              [{ text: 'Нет', callback_data: BotInitActions.PASSWORD_SKIP }],
            ],
          },
        });
      } else {
        await ctx.reply('Введите новый пароль');
      }

      (<any>ctx).wizard.state.username = username;

      ctx.wizard.next();
    }
  }

  @WizardStep(INIT_STEPS.CONFIRM)
  public async confirm(@Ctx() ctx: Scenes.WizardContext, @CtxUser() user: User, @Message('text') newPassword: string): Promise<void> {
    (<any>ctx).wizard.state.password = newPassword;

    const { state } = (<any>ctx).wizard;

    const username = state.username || user.username;
    const password = state.password || user.password;

    await ctx.reply(`Логин: *${username}*\nПароль: *${password}*`, { parse_mode: 'MarkdownV2' });
    await ctx.reply('Сохранить новые данные?', {
      reply_markup: {
        one_time_keyboard: true,
        inline_keyboard: [
          [{ text: 'Да', callback_data: BotInitActions.DATA_CONFIRM }],
          [{ text: 'Отменить', callback_data: BotInitActions.DATA_CANCEL }],
          [{ text: 'Изменить', callback_data: BotInitActions.DATA_CHANGE }],
        ],
      },
    });
  }

  @Action(new RegExp(`${BotInitActions.USERNAME_SKIP}`))
  public async handleUsernameSkip(@Ctx() ctx: Scenes.WizardContext, @Next() next: () => Promise<void>, @CtxUser() user: User) {
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
    await ctx.editMessageText(`Ваш старый логин: *${user.username}*\n\nХотите поменять? *Нет*`, { parse_mode: 'MarkdownV2' });

    // set to Username step, the next step will be trigger
    await this.runStep(ctx, next, INIT_STEPS.PASSWORD);
  }

  @Action(new RegExp(`${BotInitActions.USERNAME_CHANGE}`))
  public async handleUsernameChange(@Ctx() ctx: Scenes.WizardContext, @CtxUser() user: User) {
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
    await ctx.editMessageText(`Ваш старый логин: *${user.username}*\n\nХотите поменять? *Да*`, { parse_mode: 'MarkdownV2' });

    await ctx.reply('Введите новый логин');

    this.setStep(ctx, INIT_STEPS.PASSWORD);
  }

  @Action(new RegExp(`${BotInitActions.PASSWORD_SKIP}`))
  public async handlePasswordSkip(@Ctx() ctx: Scenes.WizardContext, @Next() next: () => Promise<void>) {
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
    await ctx.editMessageText('Хотите заменить старый пароль? *Нет*', { parse_mode: 'MarkdownV2' });
    // set to password step, the next step will be trigger
    await this.runStep(ctx, next, INIT_STEPS.CONFIRM);
  }

  @Action(new RegExp(`${BotInitActions.PASSWORD_CHANGE}`))
  public async handlePasswordChange(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
    await ctx.editMessageText('Хотите заменить старый пароль? *Да*', { parse_mode: 'MarkdownV2' });

    await ctx.reply('Введите новый пароль');

    this.setStep(ctx, INIT_STEPS.CONFIRM);
  }

  @Action(new RegExp(`${BotInitActions.DATA_CONFIRM}`))
  public async handleDataConfirm(@Ctx() ctx: Scenes.WizardContext, @CtxUser() user: User) {
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
    await ctx.editMessageText('Сохранить новые данные? *Да*', { parse_mode: 'MarkdownV2' });

    const { username, password } = (<any>ctx).wizard.state;

    await this.userService.updateUser(user.id, { username, password });

    await ctx.reply('Данные обновились успешно!');

    await ctx.scene.leave();
  }

  @Action(new RegExp(`${BotInitActions.DATA_CANCEL}`))
  public async handleDataCancel(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
    await ctx.editMessageText('Сохранить новые данные? *Нет*', { parse_mode: 'MarkdownV2' });
    await ctx.scene.leave();
  }

  @Action(new RegExp(`${BotInitActions.DATA_CHANGE}`))
  public async handleDataChange(@Ctx() ctx: Scenes.WizardContext, @Next() next: () => Promise<void>) {
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
    await ctx.editMessageText('Сохранить новые данные? *Изменить*', { parse_mode: 'MarkdownV2' });

    // rerun first step
    await this.runStep(ctx, next, INIT_STEPS.USERNAME);
  }

  private isUsernameValid(username: string) {
    return /^[a-zA-Z0-9]+$/.exec(username) !== null;
  }

  private async runStep(ctx: Scenes.WizardContext, next: () => Promise<void>, newStep: number) {
    const { step } = this.setStep(ctx, newStep);
    if (typeof step === 'function') await step(ctx, next);
  }

  private setStep(ctx: Scenes.WizardContext, newStep: number) {
    // set prev step, so the next running step will be current step
    return ctx.wizard.selectStep(newStep - 1);
  }
}
