import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';

import { UserRole } from '@/modules/user';

import { BotCommand, BotContext } from '../interfaces';

@Injectable()
export class BotVerifiedGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const ctx = TelegrafExecutionContext.create(context);
    const botContext = ctx.getContext<BotContext>();

    const isAdmin = !botContext.user.role || ![UserRole.ADMIN, UserRole.SUPERADMIN].includes(botContext.user.role);
    if (!botContext.user.verified && !isAdmin) {
      throw new TelegrafException(`Вы не верифицированы для этого действия. Вам нужно будет сделать запрос на админа\n\n/${BotCommand.REQUEST_VERIFY}`);
    }

    return true;
  }
}
