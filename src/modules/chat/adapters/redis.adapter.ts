import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientOptions } from 'redis';
import type { ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor!: ReturnType<typeof createAdapter>;

  public async connectToRedis(options: RedisClientOptions): Promise<void> {
    const pubClient = createClient(options);
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public override createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    server.adapter(this.adapterConstructor);
    return server;
  }
}
