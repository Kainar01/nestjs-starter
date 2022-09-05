import type { Context, Scenes } from 'telegraf';

import type { User } from '@/modules/user';

export enum BotCommand {
  START = 'start',
  QUIT = 'quit',
  INIT = 'init',
  ASSIGNMENTS = 'assignments',
  SCHEDULE = 'schedule',
}

export enum BotAction {
  REGISTER = 'register',
}

export interface BotContext extends Context, Scenes.SceneContext {
  user: User;
}
