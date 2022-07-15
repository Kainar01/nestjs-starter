import { Logger as NestLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { middleware } from './app.middleware';
import { AppModule } from './app.module';
import { ConfigService, Logger } from './common';
import { RedisIoAdapter } from './modules/chat/adapters/redis.adapter';

/**
 * https://docs.nestjs.com
 * https://github.com/nestjs/nest/tree/master/sample
 * https://github.com/nestjs/nest/issues/2249#issuecomment-494734673
 */
async function bootstrap(): Promise<string> {
  const isProduction = (process.env.NODE_ENV === 'production');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(await app.resolve(Logger));

  if (isProduction) {
    app.enable('trust proxy');
  }
  // Express Middleware
  middleware(app);

  const config: ConfigService = await app.resolve(ConfigService);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(config.get('redis'));

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(process.env.PORT || 3000);

  return app.getUrl();
}

(async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();
