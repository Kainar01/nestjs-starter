import type { Context, Scenes } from 'telegraf';

import type { User } from '@/modules/user';

export enum BotCommand {
  START = 'start',
  QUIT = 'quit',
  INIT = 'init',
  LIST_TASKS = 'list-tasks',
  RESCHEDULE = 'reschedule',
}

export enum BotAction {
  REGISTER = 'register',
}

export interface BotContext extends Context, Scenes.SceneContext {
  user: User;
}
