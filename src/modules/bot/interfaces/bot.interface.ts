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

export enum BotInitActions {
  DATA_CONFIRM = 'data:confirm',
  DATA_CANCEL = 'data:cancel',
  DATA_CHANGE = 'data:change',
  PASSWORD_SKIP = 'password:skip',
  PASSWORD_CHANGE = 'password:change',
  USERNAME_SKIP = 'username:skip',
  USERNAME_CHANGE = 'username:change',
}

export interface BotContext extends Context, Scenes.SceneContext {
  user: User;
}
